const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Simpan file di folder uploads dengan nama acak agar tidak bisa ditebak
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${ext}`);
  },
});

// Hanya izinkan jpg, png, dan pdf
function fileFilter(req, file, cb) {
  const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Tipe file harus jpg, png, atau pdf"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // maksimal 5 MB
});

module.exports = upload;
