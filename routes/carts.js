const express = require("express");
const router = express.Router();
const { userModel, validator } = require("../models/user");
const _ = require("../utils/loadash");
const {cart, add, remove} = require("../controllers/cart");

router.get("/", cart);

router.post("/add", add);

router.post("/remove", remove);


module.exports = router;
