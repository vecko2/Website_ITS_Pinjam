const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Semua route notifikasi butuh login
router.use(authMiddleware);

router.get("/", notificationController.getMine);
router.put("/read-all", notificationController.markAllRead);
router.put("/:id/read", notificationController.markRead);

// Endpoint bantu untuk menguji pengingat H-1 (boleh dihapus saat produksi)
router.post("/run-reminders", notificationController.runReminders);

module.exports = router;
