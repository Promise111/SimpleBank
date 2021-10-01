const { itemsModel } = require("../../models/item");
const { cardModel } = require("../../models/card");
const { userModel } = require("../../models/user");
const Joi = require("joi");
const { randomNumbers, transport } = require("../../utils/functions");
const card = require("./card");
Joi.objectId = require("joi-objectid")(Joi);

exports.mart = async (req, res) => {
  items = await itemsModel.find();
  return res.render("mart", {
    name: "Mini Mart",
    items: items,
  });
};

exports.createItems = async (req, res) => {
  const body = req.body;
  //   console.log(body);
  const create = new itemsModel(body);
  let result = await create.save(body);
  return res.send("success");
};

exports.item = async (req, res) => {
  const slug = req.params.slug;
  const item = await itemsModel.findOne({ slug: slug });
  const quantity = Number.parseInt(req.body.purchaseQuantity);

  return res.render("item", {
    item: item,
    numberInCart: 3,
    errorMessage: "",
  });
};

exports.payment = async (req, res) => {
  const query = req.query;
  const { error } = paymentValidator(query);
  const product = query.product && (await itemsModel.findById(query.product));
  try {
    return res.render("payment", {
      title: "Payment",
      product: product,
      quantity: query.quantity,
    });
  } catch (error) {
    return res.render("payment", {
      title: "Payment",
      product: product,
      quantity: query.quantity,
      errorMessage: error.message,
    });
    // console.log(error.message);
  }
};

exports.otp = async (req, res) => {
  const body = req.body;
  const { error } = paymentFormValidator(body);
  const product = body.product && (await itemsModel.findById(body.product));
  const expiry = `${body.month}/${body.year.substr(2, 2)}`;
  const otp = randomNumbers(3);
  var owner;
  const card =
    body.cardnumber &&
    (await cardModel.findOne({
      cardNumber: body.cardnumber,
      cvv: body.cvv,
      expiryDate: expiry,
    }));
  // console.log(body);
  try {
    if (!product) return res.status(400).send("Item does not exist");
    if (!card) return res.status(400).send("Invalid card");
    owner = await userModel.findById(card.owner);
    if (owner.accountbalance < parseInt(body.quantity * body.priceperunit))
      return res.status(400).send("Insufficient balance");

    transport.sendMail({
      from: "'Simple Bank' <bank@simplebank.com>",
      // to: `${owner.email}`,
      to: `promiseihunna@gmail.com`,
      subject: "OTP Code",
      text: `Your OTP Code: ${otp}`,
    });

    card.otp = otp;

    otpResult = card.save();

    if (otpResult)
      return res.render("otp", {
        title: "",
        body: body,
        card: card,
        owner: owner,
        errorMessage: error.message,
      });
  } catch (error) {
    return res.render("otp", {
      title: "",
      body: body,
      card: card,
      owner: owner,
      errorMessage: error.message,
    });
  }
};

exports.purchase = async (req, res) => {
  const body = req.body;
  const product = body.product && (await itemsModel.findById(body.product));
  const owner = body.owner && (await userModel.findById(body.owner));
  const card = body.card && (await cardModel.findById(body.card));
  const quantity = body.quantity;
  const pricePerunit = body.priceperunit;
  const debitAmount = parseInt(quantity) * parseInt(pricePerunit);

  try {
    if (body.otp === card.otp) {
      owner.accountbalance -= debitAmount;

      const debitResult = await owner.save();

      if (debitResult) {
        product.quantity -= body.quantity;
        product.save();
        // return res.send(
        // `successful purchase of ${body.quantity} ${
        //   body.quantity > 1 ? "units" : "unit"
        // } of ${product.name}`
        // );
        return res.render("purchase", {
          title: "Successful Purchase",
          message: `Successful purchase of ${body.quantity} ${
            body.quantity > 1 ? "units" : "unit"
          } of ${product.name}`,
        });
      }
    }

    return res.status(400).send("<h4 style='text-align:center'>Invalid OTP Code</h4>");
  } catch (error) {
    return res.render("purchase", {
      title: "Unsuccessful Purchase",
      message: "Something went wrong, retry",
    });
  }
};

function paymentFormValidator(obj) {
  const schema = Joi.object({
    cardname: Joi.string().required(),
    cardnumber: Joi.number().required(),
    cvv: Joi.number().required(),
    month: Joi.number().min(1).max(12).required(),
    amount: Joi.number().required(),
    product: Joi.objectId().required(),
    quantity: Joi.number().required(),
    priceperunit: Joi.number().required(),
    year: Joi.number()
      .min(new Date().getFullYear())
      .max(new Date().getFullYear() + 15)
      .required(),
  });
  return schema.validate(obj);
}

function paymentValidator(obj) {
  const schema = Joi.object({
    product: Joi.objectId().required(),
    quantity: Joi.string().max(100).required(),
  });
  return schema.validate(obj);
}
