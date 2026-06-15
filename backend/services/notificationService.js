const db = require("../database/db");

// Helper internal untuk membuat notifikasi in-app
async function createNotification(userId, title, message, type = "system", relatedId = null) {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type, related_id)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, message, type, relatedId]
    );
  } catch (err) {
    console.error("Gagal membuat notifikasi:", err.message);
  }
}

module.exports = { createNotification };
