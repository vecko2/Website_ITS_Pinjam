const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Semua route keranjang hanya untuk peminjam yang login
router.use(authMiddleware, roleMiddleware("peminjam"));

router.get("/", cartController.getMine);
router.post("/", cartController.add);
router.delete("/:id", cartController.remove);

module.exports = router;
