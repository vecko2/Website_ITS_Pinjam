const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Register menerima 2 file: photo_ktm dan photo_ktp
router.post(
  "/register",
  upload.fields([
    { name: "photo_ktm", maxCount: 1 },
    { name: "photo_ktp", maxCount: 1 },
  ]),
  authController.register
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Endpoint /me dilindungi, butuh token valid
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
