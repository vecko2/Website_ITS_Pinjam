const cron = require("node-cron");
const db = require("../database/db");
const { createNotification } = require("./notificationService");
const { sendEmail } = require("./mailer");

// ============================
// 1. Batalkan transaksi yang belum dibayar melewati batas 25 menit
// ============================
async function cancelExpiredPayments() {
  try {
    const [rows] = await db.query(
      `SELECT t.id, t.item_id, t.borrower_id, i.name AS item_name
       FROM transactions t
       JOIN items i ON t.item_id = i.id
       WHERE t.status = 'confirmed'
         AND t.payment_deadline IS NOT NULL
         AND t.payment_deadline < NOW()`
    );

    for (const trx of rows) {
      await db.query("UPDATE transactions SET status = 'cancelled' WHERE id = ?", [trx.id]);
      await db.query("UPDATE items SET status = 'available' WHERE id = ?", [trx.item_id]);
      await createNotification(
        trx.borrower_id,
        "Pembayaran kedaluwarsa",
        `Waktu pembayaran untuk "${trx.item_name}" telah habis. Pesanan dibatalkan.`,
        "transaction",
        trx.id
      );
    }
    if (rows.length > 0) {
      console.log(`[Scheduler] ${rows.length} transaksi kedaluwarsa dibatalkan.`);
    }
  } catch (err) {
    console.error("[Scheduler] cancelExpiredPayments error:", err.message);
  }
}

// ============================
// 2. Kirim pengingat H-1 untuk sewa yang berakhir besok
// ============================
async function sendH1Reminders() {
  try {
    const [rows] = await db.query(
      `SELECT t.id, t.end_date, t.borrower_id, i.name AS item_name, u.email AS borrower_email
       FROM transactions t
       JOIN items i ON t.item_id = i.id
       JOIN users u ON t.borrower_id = u.id
       WHERE t.status = 'active'
         AND DATE(t.end_date) = DATE(DATE_ADD(NOW(), INTERVAL 1 DAY))`
    );

    for (const trx of rows) {
      await createNotification(
        trx.borrower_id,
        "Masa sewa berakhir besok",
        `Masa sewa "${trx.item_name}" akan berakhir besok. Mohon siapkan pengembalian barang.`,
        "reminder",
        trx.id
      );
      await sendEmail(
        trx.borrower_email,
        "Pengingat: Masa sewa berakhir besok - ITSPinjam",
        `<p>Halo,</p>
         <p>Masa sewa <b>${trx.item_name}</b> Anda akan berakhir besok.
         Mohon siapkan pengembalian barang kepada pemilik.</p>
         <p>Terima kasih,<br/>ITSPinjam</p>`
      );
    }
    if (rows.length > 0) {
      console.log(`[Scheduler] ${rows.length} pengingat H-1 dikirim.`);
    }
  } catch (err) {
    console.error("[Scheduler] sendH1Reminders error:", err.message);
  }
}

// Aktifkan penjadwalan
function startScheduler() {
  // Setiap menit: cek pembayaran kedaluwarsa
  cron.schedule("* * * * *", cancelExpiredPayments);
  // Setiap hari pukul 08:00: kirim pengingat H-1
  cron.schedule("0 8 * * *", sendH1Reminders);
  console.log("[Scheduler] Penjadwalan aktif.");
}

module.exports = { startScheduler, sendH1Reminders, cancelExpiredPayments };
