const { userModel, validator, hash } = require("../../models/user");
const { randomNumbers } = require("../../utils/functions");
const nodeMailer = require("nodemailer");
const { cardModel } = require("../../models/card");

module.exports = async (req, res) => {
  const body = req.body;
  const authUser = req.user;
  const { error } = validator(body);
  const date = new Date();
  const cardNumber = randomNumbers(15);
  const cvvNumber = randomNumbers(2);
  const pin = randomNumbers(3);
  const expiry = `${date.getMonth()}/${(date.getFullYear() + 3)
    .toString()
    .substr(2, 2)}`;
  const authUserCard = await cardModel.findOne({ owner: authUser._id });
  if (authUserCard)
    return res.status(400).json({
      success: true,
      message: "card already generated",
      cardNumber: authUserCard.cardNumber,
      cvv: authUserCard.cvv,
      pin: authUserCard.cardPin,
      expiry: authUserCard.expiryDate,
    });
  const card = new cardModel({
    owner: authUser._id,
    cardNumber: cardNumber,
    cvv: cvvNumber,
    cardPin: pin,
    expiryDate: expiry,
  });
  const cardResult = await card.save();
  return res.status(200).json({
    success: true,
    message: "card Generated",
    cardNumber: cardNumber,
    cvv: cvvNumber,
    pin: pin,
    expiry: expiry,
  });
};
