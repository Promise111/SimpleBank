const express = require("express");
const router = express.Router();
const { userModel, validator } = require("../models/user");
const _ = require("../utils/loadash");
const transfers = require("../controllers/bank/transfers");
const balance = require("../controllers/bank/balance");
const authMiddleware = require("../middlewares/auth");
const deposit = require("../controllers/bank/deposit");

router.post("/transfers", [authMiddleware], transfers);

router.post("/deposits", [authMiddleware], deposit);

router.post("/balance", [authMiddleware], [authMiddleware], balance);

module.exports = router;
