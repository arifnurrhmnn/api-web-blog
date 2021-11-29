const express = require("express");

const router = express.Router();

// Memanggil fungsi dari controllers
const authController = require("../controllers/auth");

router.post("/register", authController.register);

module.exports = router;
