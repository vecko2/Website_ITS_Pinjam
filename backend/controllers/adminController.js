const db = require("../database/db");
const { createNotification } = require("../services/notificationService");

// ============================
// Statistik dashboard
// ============================
exports.getStats = async (req, res) => {
  try {
    const [[users]] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role != 'admin'");
    const [[items]] = await db.query("SELECT COUNT(*) AS total FROM items");
    const [[activeTrx]] = await db.query("SELECT COUNT(*) AS total FROM transactions WHERE status = 'active'");
    const [[allTrx]] = await db.query("SELECT COUNT(*) AS total FROM transactions");

    res.json({
      stats: {
        users: users.total,
        items: items.total,
        activeTransactions: activeTrx.total,
        totalTransactions: allTrx.total,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil statistik", error: err.message });
  }
};

// ============================
// Daftar semua user (kecuali admin)
// ============================
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, username, role, nrp, department, phone,
              photo_ktm, photo_ktp, is_active, is_verified, created_at
       FROM users
       WHERE role != 'admin'
       ORDER BY created_at DESC`
    );
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil user", error: err.message });
  }
};

// ============================
// Verifikasi user (set is_verified = TRUE)
// ============================
exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE users SET is_verified = TRUE WHERE id = ?", [id]);

    // Beri tahu user bahwa akunnya diverifikasi
    await createNotification(
      id,
      "Akun terverifikasi",
      "Akun Anda telah diverifikasi oleh admin. Anda dapat menggunakan semua fitur ITSPinjam.",
      "system"
    );

    res.json({ message: "User berhasil diverifikasi" });
  } catch (err) {
    res.status(500).json({ message: "Gagal verifikasi user", error: err.message });
  }
};

// ============================
// Aktif / nonaktifkan user (toggle)
// ============================
exports.toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const [[user]] = await db.query("SELECT is_active FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const newStatus = user.is_active ? 0 : 1;
    await db.query("UPDATE users SET is_active = ? WHERE id = ?", [newStatus, id]);
    res.json({ message: newStatus ? "User diaktifkan" : "User dinonaktifkan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah status user", error: err.message });
  }
};

// ============================
// Daftar semua barang
// ============================
exports.getItems = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT i.id, i.name, i.title, i.images, i.status, i.is_active,
              i.price_daily, c.name AS category_name, u.name AS owner_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.owner_id = u.id
       ORDER BY i.created_at DESC`
    );
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil barang", error: err.message });
  }
};

// ============================
// Aktif / nonaktifkan publikasi barang
// ============================
exports.toggleItemActive = async (req, res) => {
  try {
    const { id } = req.params;
    const [[item]] = await db.query("SELECT is_active FROM items WHERE id = ?", [id]);
    if (!item) return res.status(404).json({ message: "Barang tidak ditemukan" });

    const newStatus = item.is_active ? 0 : 1;
    await db.query("UPDATE items SET is_active = ? WHERE id = ?", [newStatus, id]);
    res.json({ message: newStatus ? "Barang ditampilkan" : "Barang disembunyikan" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah status barang", error: err.message });
  }
};

// ============================
// Hapus barang (admin bisa hapus milik siapa saja)
// ============================
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM items WHERE id = ?", [id]);
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus barang", error: err.message });
  }
};

// ============================
// Daftar semua transaksi
// ============================
exports.getTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query(
      `SELECT t.id, t.rental_period, t.start_date, t.end_date, t.total_price, t.status,
              i.name AS item_name, b.name AS borrower_name, o.name AS owner_name
       FROM transactions t
       JOIN items i ON t.item_id = i.id
       JOIN users b ON t.borrower_id = b.id
       JOIN users o ON i.owner_id = o.id
       ORDER BY t.created_at DESC`
    );
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil transaksi", error: err.message });
  }
};
