const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  purchaseQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const cartSchema = mongoose.Schema({
  items: [itemSchema],
  subTotal: {
    default: 0,
    type: Number,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
