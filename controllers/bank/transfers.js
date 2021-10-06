const Joi = require("joi");
const nodeMailer = require("nodemailer");
const { userModel } = require("../../models/user");
const { transactionModel } = require("../../models/transaction");

module.exports = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const { error } = validator(body);
  var receiverResult;
  var transactionResult;
  const least = new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
  }).format(100);

  const userAccount = await userModel
    .findOne({ email: user.email })
    .select("-password");

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  const receiver = await userModel
    .findOne({
      accountnumber: body.account_number,
    })
    .select(" -password");

  if (userAccount.accountbalance < body.amount)
    return res
      .status(400)
      .json({ success: false, message: "insufficient funds" });

  if (body.account_number == user.accountnumber)
    return res.status(403).json({
      success: false,
      message: "transfer to own account can not be initiated",
    });

  try {
    if (parseInt(body.amount) < 100)
      return res.status(400).json({
        success: false,
        message: "Can not transfer amounts less than 100",
      });

    receiver.accountbalance += parseInt(body.amount);
    userAccount.accountbalance -= parseInt(body.amount);

    var userResult = await userAccount.save();

    if (userResult) receiverResult = await receiver.save();

    if (receiverResult) {
      let transaction = new transactionModel({
        sender: userAccount._id,
        receiver: receiver._id,
        amount: body.amount,
      });
      transactionResult = transaction.save();
    }

    if (transactionResult) {
      return res.status(200).json({
        success: true,
        receiver_account_number: body.account_number,
        amount: body.amount,
        balance: userAccount.accountbalance,
        receiver_name: `${receiver.firstname} ${receiver.lastname}`,
        timestamp: new Date().getTime(),
      });
    }
  } catch (err) {
    return res.status(500).send(`${err.message},${err.stack}`);
  }
};

const validator = (obj) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
    account_number: Joi.string().required(),
  });
  return schema.validate(obj);
};
