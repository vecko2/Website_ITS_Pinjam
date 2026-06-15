const db = require("../database/db");

// ============================
// GET semua barang (search, filter kategori, urutan) - katalog publik
// ============================
exports.getAll = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = `
      SELECT i.id, i.title, i.name, i.description,
             i.price_daily, i.price_weekly, i.price_monthly, i.price_yearly,
             i.images, i.status,
             c.name AS category_name, c.slug AS category_slug
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.is_active = TRUE
    `;
    const params = [];

    if (search) {
      query += " AND (i.name LIKE ? OR i.title LIKE ? OR i.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      query += " AND c.slug = ?";
      params.push(category);
    }
    if (sort === "termurah") {
      query += " ORDER BY i.price_daily ASC";
    } else if (sort === "termahal") {
      query += " ORDER BY i.price_daily DESC";
    } else {
      query += " ORDER BY i.created_at DESC";
    }

    const [items] = await db.query(query, params);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data barang", error: err.message });
  }
};

// ============================
// GET detail satu barang (+ data pemilik + tanggal sewa aktif untuk progress bar)
// ============================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [items] = await db.query(
      `SELECT i.*, c.name AS category_name,
              u.name AS owner_name, u.department AS owner_department, u.phone AS owner_phone,
              t.start_date AS active_start, t.end_date AS active_end
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.owner_id = u.id
       LEFT JOIN transactions t ON t.item_id = i.id AND t.status = 'active'
       WHERE i.id = ?`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }
    res.json({ item: items[0] });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil detail barang", error: err.message });
  }
};

// ============================
// GET barang milik pemilik yang sedang login
// ============================
exports.getMine = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT i.*, c.name AS category_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.owner_id = ?
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil barang", error: err.message });
  }
};

// ============================
// CREATE barang baru
// ============================
exports.create = async (req, res) => {
  try {
    const {
      title, name, description, category_id,
      price_daily, price_weekly, price_monthly, price_yearly,
    } = req.body;

    if (!title || !name) {
      return res.status(400).json({ message: "Judul dan nama barang wajib diisi" });
    }

    const imageFiles = req.files?.images || [];
    const images = imageFiles.map((f) => f.filename);
    const qrisCode = req.files?.qris_code?.[0]?.filename || null;

    if (images.length === 0) {
      return res.status(400).json({ message: "Minimal upload 1 foto barang" });
    }

    const [result] = await db.query(
      `INSERT INTO items
        (owner_id, category_id, title, name, description,
         price_daily, price_weekly, price_monthly, price_yearly,
         images, qris_code, status, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', TRUE)`,
      [
        req.user.id, category_id || null, title, name, description || null,
        price_daily || null, price_weekly || null, price_monthly || null, price_yearly || null,
        JSON.stringify(images), qrisCode,
      ]
    );

    res.status(201).json({ message: "Barang berhasil ditambahkan", itemId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan barang", error: err.message });
  }
};

// ============================
// UPDATE barang (hanya pemilik barang itu)
// ============================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, name, description, category_id,
      price_daily, price_weekly, price_monthly, price_yearly,
    } = req.body;

    const [rows] = await db.query("SELECT * FROM items WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }
    if (rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ message: "Anda bukan pemilik barang ini" });
    }

    const imageFiles = req.files?.images || [];
    let images;
    if (imageFiles.length > 0) {
      images = JSON.stringify(imageFiles.map((f) => f.filename));
    } else {
      images = JSON.stringify(rows[0].images || []);
    }

    let qrisCode = rows[0].qris_code;
    if (req.files?.qris_code?.[0]) {
      qrisCode = req.files.qris_code[0].filename;
    }

    await db.query(
      `UPDATE items SET
        title = ?, name = ?, description = ?, category_id = ?,
        price_daily = ?, price_weekly = ?, price_monthly = ?, price_yearly = ?,
        images = ?, qris_code = ?
       WHERE id = ?`,
      [
        title, name, description || null, category_id || null,
        price_daily || null, price_weekly || null, price_monthly || null, price_yearly || null,
        images, qrisCode, id,
      ]
    );

    res.json({ message: "Barang berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui barang", error: err.message });
  }
};

// ============================
// DELETE barang (hanya pemilik barang itu)
// ============================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT owner_id FROM items WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }
    if (rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ message: "Anda bukan pemilik barang ini" });
    }

    await db.query("DELETE FROM items WHERE id = ?", [id]);
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus barang", error: err.message });
  }
};
