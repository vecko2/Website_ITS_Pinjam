const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// GET /api/categories -> daftar semua kategori
router.get("/", categoryController.getAll);

module.exports = router;
