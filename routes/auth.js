const express = require("express");
const router = express.Router();
const { userModel, validator } = require("../models/user");
const _ = require("../utils/loadash");
const register = require("../controllers/auth/register");
const login = require("../controllers/auth/login");

router.post("/login", login);

router.post("/register", register);

module.exports = router;
