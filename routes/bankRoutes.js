const express = require("express");
const router = express.Router();
const { userModel, validator } = require("../models/user");
const _ = require("../utils/loadash");
const transfers = require("../controllers/bank/transfers");
const balance = require("../controllers/bank/balance");
const authMiddleware = require("../middlewares/auth");
const deposit = require("../controllers/bank/deposit");
const card = require("../controllers/bank/card");
const {
  mart,
  createItems,
  item,
  payment,
  otp,
  purchase,
} = require("../controllers/bank/mart");

// router.post("/transfers", [authMiddleware], transfers);

// router.post("/deposits", [authMiddleware], deposit);

router.post("/cards", [authMiddleware], card);

// router.post("/balance", [authMiddleware], balance);

router.get("/shop", mart);

router.post("/createItem", createItems);

router.get("/shop/:slug", item);

router.get("/payments", payment);

router.post("/payments", otp);

router.post("/purchase", purchase);

router.get("/documentation", (req, res) => {
  return res.render("documentation", {
    title: "Documentation",
  });
});

module.exports = router;
