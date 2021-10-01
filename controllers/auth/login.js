const Joi = require("joi");
const crypto = require("crypto");
const { userModel, verifyPassword } = require("../../models/user");

module.exports = async (req, res) => {
  const body = req.body;
  const { error } = validator(body);

  try {
    if (error) return res.status(400).send(error.details[0].message);
    const user = await userModel.findOne({ email: body.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email and password." });

    const passowrdValid = await verifyPassword(user.password, body.password);
    if (!passowrdValid)
      return res.status(400).send("Invalid email and password");
    const token = user.authenticate();
    res.status(200).json({ access_token: token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

function validator(obj) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(obj);
}
