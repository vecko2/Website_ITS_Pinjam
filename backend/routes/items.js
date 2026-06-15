const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Upload untuk barang: banyak foto (maks 5) + 1 QRIS
const itemUpload = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "qris_code", maxCount: 1 },
]);

// PENTING: "/mine" harus didefinisikan SEBELUM "/:id"
// agar tidak salah dianggap sebagai id barang.
router.get("/", itemController.getAll);
router.get("/mine", authMiddleware, roleMiddleware("pemilik"), itemController.getMine);
router.get("/:id", itemController.getById);

// Hanya pemilik yang bisa tambah/ubah/hapus barang
router.post("/", authMiddleware, roleMiddleware("pemilik"), itemUpload, itemController.create);
router.put("/:id", authMiddleware, roleMiddleware("pemilik"), itemUpload, itemController.update);
router.delete("/:id", authMiddleware, roleMiddleware("pemilik"), itemController.remove);

module.exports = router;
