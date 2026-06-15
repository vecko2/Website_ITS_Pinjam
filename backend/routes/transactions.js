const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// --- Peminjam ---
router.post("/", roleMiddleware("peminjam"), transactionController.create);
router.get("/borrower", roleMiddleware("peminjam"), transactionController.getBorrowerTransactions);
router.put("/:id/confirm-borrow", roleMiddleware("peminjam"), transactionController.confirmBorrow);

// --- Pemilik ---
router.get("/owner", roleMiddleware("pemilik"), transactionController.getOwnerTransactions);
router.put("/:id/confirm-payment", roleMiddleware("pemilik"), transactionController.confirmPayment);
router.put("/:id/confirm-return", roleMiddleware("pemilik"), transactionController.confirmReturn);

module.exports = router;
