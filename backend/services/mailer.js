const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  // Kalau email belum dikonfigurasi di .env, kembalikan null
  if (!process.env.MAIL_USER) return null;

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  return transporter;
}

// Kirim email. Kalau belum dikonfigurasi, cukup tampilkan di terminal.
async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.log(`[EMAIL dilewati - belum dikonfigurasi] ke: ${to} | ${subject}`);
    return;
  }
  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || "ITSPinjam <no-reply@itspinjam.id>",
      to,
      subject,
      html,
    });
    console.log(`[EMAIL terkirim] ke: ${to} | ${subject}`);
  } catch (err) {
    console.error(`[EMAIL gagal] ${err.message}`);
  }
}

module.exports = { sendEmail };
