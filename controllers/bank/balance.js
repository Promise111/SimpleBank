const Joi = require("joi");
const { userModel } = require("../../models/user");

module.exports = async (req, res) => {
  const user = req.user;
  // const { error } = validator(body);
  let naira = new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
  });
  const hour12 = new Intl.DateTimeFormat("en", {
    timeStyle: "medium",
    dateStyle: "short",
  }).format(new Date());

  try {
    // if (error) return res.status(400).send(error.details[0].message);
    const account = await userModel.findOne({
      accountnumber: user.accountnumber,
    });
    if (!account) return res.status(400).send("Invalid account number");
    const balance = account.accountbalance;
    if (account)
      return res.status(200).json({
        time: hour12.split(",")[1],
        date: new Date().toLocaleDateString(),
        balance: balance,
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const validator = (obj) => {
  const schema = Joi.object({
    accountnumber: Joi.string().required(),
  });
  return schema.validate(obj);
};
