const mongoose = require("mongoose");
const Joi = require("joi");

const cardSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  cardPin: {
    type: String,
    required: true
  },
  otp: {
    type: String,
  },
  expiryDate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

exports.cardModel = mongoose.model("Card", cardSchema);
