const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

// ============================
// REGISTER
// ============================
exports.register = async (req, res) => {
  try {
    const {
      name, email, username, password, role,
      nrp, department, angkatan, phone, address,
    } = req.body;

    // Validasi field wajib
    if (!name || !email || !username || !password || !role) {
      return res.status(400).json({ message: "Data wajib belum lengkap" });
    }

    // Hanya peminjam atau pemilik yang boleh daftar dari sini
    if (!["peminjam", "pemilik"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    // Cek email/username sudah dipakai
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email atau username sudah terdaftar" });
    }

    // Ambil file yang diupload
    const photoKtm = req.files?.photo_ktm?.[0]?.filename || null;
    const photoKtp = req.files?.photo_ktp?.[0]?.filename || null;

    // KTM wajib untuk semua, KTP wajib untuk pemilik
    if (!photoKtm) {
      return res.status(400).json({ message: "Foto KTM wajib diupload" });
    }
    if (role === "pemilik" && !photoKtp) {
      return res.status(400).json({ message: "Foto KTP wajib untuk pemilik barang" });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const [result] = await db.query(
      `INSERT INTO users
        (name, email, username, password, role, nrp, department, angkatan, phone, address, photo_ktm, photo_ktp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, email, username, hashedPassword, role,
        nrp || null, department || null, angkatan || null,
        phone || null, address || null, photoKtm, photoKtp,
      ]
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      userId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// ============================
// LOGIN
// ============================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    // Bisa login pakai username atau email
    const [users] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: "Akun Anda dinonaktifkan" });
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // Buat token JWT (berlaku 7 hari)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// ============================
// GET PROFIL (cek token & ambil data user yang login)
// ============================
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, username, role, nrp, department, phone FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// ============================
// LOGOUT
// ============================
exports.logout = (req, res) => {
  // JWT bersifat stateless, jadi logout cukup hapus token di sisi frontend.
  res.json({ message: "Logout berhasil" });
};
