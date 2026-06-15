const db = require("../database/db");

// GET semua kategori
exports.getAll = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories ORDER BY id");
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil kategori", error: err.message });
  }
};
