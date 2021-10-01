const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 2,
    maxlength: 15,
  },
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 15,
  },
  middlename: {
    type: String,
  },
  dob: {
    type: String,
    minlength: 2,
    maxlength: 15,
  },
  accountnumber: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  accountbalance: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  atmcardnumber: {
    type: String,
  },
  cvvnumber: {
    type: String,
  },
  balanceUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods.authenticate = function () {
  return jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      accountnumber: this.accountnumber,
    },
    process.env.JWT_PRIVATE,
    { expiresIn: "2h" }
  );
};

exports.userModel = mongoose.model("User", userSchema);

exports.validator = (obj) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).max(15).required(),
    lastname: Joi.string().min(2).max(15).required(),
    middlename: Joi.string().min(2).max(15).required(),
    dob: Joi.date().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirm_password: Joi.ref("password"),
  });
  return schema.validate(obj);
};

exports.hash = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
};

exports.verifyPassword = async (hash, password) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_PRIVATE);
};
