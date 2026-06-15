const db = require("../database/db");
const { sendH1Reminders } = require("../services/scheduler");

// Notifikasi milik user yang login + jumlah belum dibaca
exports.getMine = async (req, res) => {
  try {
    const [notifications] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    const [[{ unread }]] = await db.query(
      "SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ notifications, unread });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil notifikasi", error: err.message });
  }
};

// Tandai satu notifikasi sudah dibaca
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    res.json({ message: "Notifikasi ditandai dibaca" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui notifikasi", error: err.message });
  }
};

// Tandai semua notifikasi sudah dibaca
exports.markAllRead = async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", [req.user.id]);
    res.json({ message: "Semua notifikasi ditandai dibaca" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui notifikasi", error: err.message });
  }
};

// (Untuk testing) jalankan pengingat H-1 secara manual tanpa menunggu jadwal
exports.runReminders = async (req, res) => {
  try {
    await sendH1Reminders();
    res.json({ message: "Pengingat H-1 dijalankan. Cek halaman notifikasi & terminal backend." });
  } catch (err) {
    res.status(500).json({ message: "Gagal menjalankan pengingat", error: err.message });
  }
};
