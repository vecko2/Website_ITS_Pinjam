const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Semua route admin butuh login DAN role admin
router.use(authMiddleware, roleMiddleware("admin"));

// Statistik
router.get("/stats", adminController.getStats);

// Pengguna
router.get("/users", adminController.getUsers);
router.put("/users/:id/verify", adminController.verifyUser);
router.put("/users/:id/toggle-active", adminController.toggleUserActive);

// Barang
router.get("/items", adminController.getItems);
router.put("/items/:id/toggle-active", adminController.toggleItemActive);
router.delete("/items/:id", adminController.deleteItem);

// Transaksi
router.get("/transactions", adminController.getTransactions);

module.exports = router;
