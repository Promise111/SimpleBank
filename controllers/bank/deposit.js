const Joi = require("joi");
const { userModel } = require("../../models/user");

module.exports = async (req, res) => {
  const body = req.body;
  const user = req.user;
  let balance;
  const { error } = validator(body);

  if (error) return res.status(400).json({ message: error.details[0].message });
  userAccount = await userModel
    .findOne({ email: user.email })
    .select("-password");
  balance = userAccount.accountbalance += Number(body.amount);
  if (await userAccount.save())
    return res.status(200).json({ balance: balance, success: true });
};

function validator(obj) {
  const schema = Joi.object({
    amount: Joi.number().min(1).max(200000).required(),
  });
  return schema.validate(obj);
}
