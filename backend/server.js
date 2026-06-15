const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./database/db");

const app = express();

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Route utama
app.get("/", (req, res) => {
  res.json({ message: "ITSPinjam API berjalan" });
});

// Route cek koneksi database
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS hasil");
    res.json({ status: "ok", database: "terhubung", test: rows[0].hasil });
  } catch (err) {
    res.status(500).json({ status: "error", database: "gagal terhubung", pesan: err.message });
  }
});

// ==========================================
// ROUTE APLIKASI
// ==========================================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/items", require("./routes/items"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin", require("./routes/admin"));

// Penanganan error global (termasuk error dari multer)
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

// Aktifkan penjadwalan (auto-cancel pembayaran kedaluwarsa + pengingat H-1)
require("./services/scheduler").startScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
