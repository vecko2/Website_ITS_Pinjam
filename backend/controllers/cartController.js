const db = require("../database/db");

// Tambah barang ke keranjang
exports.add = async (req, res) => {
  try {
    const { item_id } = req.body;
    if (!item_id) {
      return res.status(400).json({ message: "item_id wajib diisi" });
    }

    // Cek barang ada
    const [items] = await db.query("SELECT id FROM items WHERE id = ?", [item_id]);
    if (items.length === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // Cek apakah sudah ada di keranjang
    const [existing] = await db.query(
      "SELECT id FROM cart WHERE user_id = ? AND item_id = ?",
      [req.user.id, item_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Barang sudah ada di keranjang" });
    }

    await db.query("INSERT INTO cart (user_id, item_id) VALUES (?, ?)", [req.user.id, item_id]);
    res.status(201).json({ message: "Barang ditambahkan ke keranjang" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan ke keranjang", error: err.message });
  }
};

// Lihat isi keranjang
exports.getMine = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT cart.id AS cart_id, i.id, i.title, i.name, i.images, i.status,
              i.price_daily, i.price_weekly, i.price_monthly, i.price_yearly
       FROM cart
       JOIN items i ON cart.item_id = i.id
       WHERE cart.user_id = ?
       ORDER BY cart.created_at DESC`,
      [req.user.id]
    );
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil keranjang", error: err.message });
  }
};

// Hapus barang dari keranjang
exports.remove = async (req, res) => {
  try {
    const { id } = req.params; // id baris cart
    await db.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [id, req.user.id]);
    res.json({ message: "Barang dihapus dari keranjang" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus dari keranjang", error: err.message });
  }
};
