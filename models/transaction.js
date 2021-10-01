const mongoose = require("mongoose");
const Joi = require("joi");

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId },
  receiver: { type: mongoose.Types.ObjectId },
  amount: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

exports.transactionModel = mongoose.model("Transaction", transactionSchema);
