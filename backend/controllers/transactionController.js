const db = require("../database/db");
const { createNotification } = require("../services/notificationService");

// Pemetaan periode -> kolom harga
function periodColumn(period) {
  return {
    daily: "price_daily",
    weekly: "price_weekly",
    monthly: "price_monthly",
    yearly: "price_yearly",
  }[period];
}

// Hitung tanggal selesai dari tanggal mulai + periode + jumlah
function calcEndDate(startDate, period, qty) {
  const end = new Date(startDate);
  if (period === "daily") end.setDate(end.getDate() + qty);
  else if (period === "weekly") end.setDate(end.getDate() + qty * 7);
  else if (period === "monthly") end.setMonth(end.getMonth() + qty);
  else if (period === "yearly") end.setFullYear(end.getFullYear() + qty);
  return end.toISOString().split("T")[0];
}

// ============================
// CREATE transaksi (checkout)
// ============================
exports.create = async (req, res) => {
  try {
    const { item_id, rental_period, start_date, quantity } = req.body;

    if (!item_id || !rental_period || !start_date || !quantity) {
      return res.status(400).json({ message: "Data checkout belum lengkap" });
    }

    const qty = parseInt(quantity);
    if (qty < 1) {
      return res.status(400).json({ message: "Durasi minimal 1" });
    }

    const col = periodColumn(rental_period);
    if (!col) {
      return res.status(400).json({ message: "Periode sewa tidak valid" });
    }

    const [items] = await db.query("SELECT * FROM items WHERE id = ?", [item_id]);
    if (items.length === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }
    const item = items[0];

    if (item.status !== "available") {
      return res.status(400).json({ message: "Barang sedang tidak tersedia" });
    }

    const price = item[col];
    if (!price) {
      return res.status(400).json({ message: "Barang tidak menyediakan periode ini" });
    }

    const endDate = calcEndDate(start_date, rental_period, qty);
    const totalPrice = price * qty;

    const [result] = await db.query(
      `INSERT INTO transactions
        (borrower_id, item_id, rental_period, start_date, end_date, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, item_id, rental_period, start_date, endDate, totalPrice]
    );

    // Hapus barang dari keranjang jika ada
    await db.query("DELETE FROM cart WHERE user_id = ? AND item_id = ?", [req.user.id, item_id]);

    // Notifikasi ke pemilik: ada pesanan baru
    await createNotification(
      item.owner_id,
      "Pesanan baru",
      `Barang "${item.name}" Anda dipesan. Tunggu peminjam mengonfirmasi penerimaan.`,
      "transaction",
      result.insertId
    );

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      transactionId: result.insertId,
      end_date: endDate,
      total_price: totalPrice,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat pesanan", error: err.message });
  }
};

// ============================
// Transaksi milik peminjam
// ============================
exports.getBorrowerTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query(
      `SELECT t.*, i.name AS item_name, i.images AS item_images, i.qris_code,
              u.name AS owner_name, u.phone AS owner_phone
       FROM transactions t
       JOIN items i ON t.item_id = i.id
       JOIN users u ON i.owner_id = u.id
       WHERE t.borrower_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil transaksi", error: err.message });
  }
};

// ============================
// Transaksi pada barang milik pemilik
// ============================
exports.getOwnerTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query(
      `SELECT t.*, i.name AS item_name, i.images AS item_images,
              b.name AS borrower_name, b.phone AS borrower_phone
       FROM transactions t
       JOIN items i ON t.item_id = i.id
       JOIN users b ON t.borrower_id = b.id
       WHERE i.owner_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil transaksi", error: err.message });
  }
};

// ============================
// Peminjam konfirmasi barang diterima
// -> status 'confirmed' + mulai jendela pembayaran 25 menit + barang 'rented'
// ============================
exports.confirmBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM transactions WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    const trx = rows[0];

    if (trx.borrower_id !== req.user.id) {
      return res.status(403).json({ message: "Bukan transaksi Anda" });
    }
    if (trx.status !== "pending") {
      return res.status(400).json({ message: "Transaksi tidak dalam status pending" });
    }

    // Mulai jendela pembayaran 25 menit
    await db.query(
      `UPDATE transactions
       SET status = 'confirmed', payment_deadline = DATE_ADD(NOW(), INTERVAL 25 MINUTE)
       WHERE id = ?`,
      [id]
    );
    await db.query("UPDATE items SET status = 'rented' WHERE id = ?", [trx.item_id]);

    // Notifikasi ke pemilik
    const [[item]] = await db.query("SELECT owner_id, name FROM items WHERE id = ?", [trx.item_id]);
    await createNotification(
      item.owner_id,
      "Menunggu pembayaran",
      `Peminjam telah menerima "${item.name}" dan sedang melakukan pembayaran QRIS.`,
      "transaction",
      id
    );

    res.json({ message: "Barang dikonfirmasi diterima. Silakan bayar via QRIS dalam 25 menit." });
  } catch (err) {
    res.status(500).json({ message: "Gagal konfirmasi", error: err.message });
  }
};

// ============================
// Pemilik verifikasi pembayaran berhasil
// -> status 'active' (masa sewa berjalan)
// ============================
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT t.*, i.owner_id, i.name AS item_name
       FROM transactions t JOIN items i ON t.item_id = i.id WHERE t.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    const trx = rows[0];

    if (trx.owner_id !== req.user.id) {
      return res.status(403).json({ message: "Anda bukan pemilik barang ini" });
    }
    if (trx.status !== "confirmed") {
      return res.status(400).json({ message: "Transaksi belum di tahap pembayaran" });
    }

    await db.query(
      "UPDATE transactions SET status = 'active', payment_deadline = NULL WHERE id = ?",
      [id]
    );

    // Notifikasi ke peminjam
    await createNotification(
      trx.borrower_id,
      "Pembayaran dikonfirmasi",
      `Pembayaran untuk "${trx.item_name}" telah dikonfirmasi. Masa sewa dimulai.`,
      "transaction",
      id
    );

    res.json({ message: "Pembayaran dikonfirmasi. Masa sewa dimulai." });
  } catch (err) {
    res.status(500).json({ message: "Gagal verifikasi pembayaran", error: err.message });
  }
};

// ============================
// Pemilik verifikasi pengembalian
// -> status 'completed' + barang 'available'
// ============================
exports.confirmReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT t.*, i.owner_id, i.name AS item_name
       FROM transactions t JOIN items i ON t.item_id = i.id WHERE t.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    const trx = rows[0];

    if (trx.owner_id !== req.user.id) {
      return res.status(403).json({ message: "Anda bukan pemilik barang ini" });
    }
    if (trx.status !== "active") {
      return res.status(400).json({ message: "Transaksi belum aktif" });
    }

    await db.query(
      "UPDATE transactions SET status = 'completed', owner_confirmed = TRUE WHERE id = ?",
      [id]
    );
    await db.query("UPDATE items SET status = 'available' WHERE id = ?", [trx.item_id]);

    // Notifikasi ke peminjam
    await createNotification(
      trx.borrower_id,
      "Transaksi selesai",
      `Pengembalian "${trx.item_name}" telah diverifikasi. Terima kasih telah menggunakan ITSPinjam.`,
      "transaction",
      id
    );

    res.json({ message: "Pengembalian diverifikasi. Transaksi selesai." });
  } catch (err) {
    res.status(500).json({ message: "Gagal verifikasi pengembalian", error: err.message });
  }
};
