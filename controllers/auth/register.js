const { userModel, validator, hash } = require("../../models/user");
const { accountNumberGenerator } = require("../../utils/functions");
const nodeMailer = require("nodemailer");

module.exports = async (req, res) => {
  const body = req.body;
  const { error } = validator(body);
  // const transporter = nodeMailer.createTransport({
  //   host: "smtp.mandrillapp.com",
  //   port: 587,
  //   auth: {
  //     apiKey: "9kO8mG2e1A0YRsM6ghI17A",
  //   }
  // });
  const transporter = nodeMailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: "promiseihunna@gmail.com",
      pass: "y7CkRUtAQTb806mh",
    },
  });
  const mail = "promiseihunna@gmail.com";
  const mailOptions = {
    from: "bank@simplebank.com",
    to: `${body.email}`,
    subject: "Simple Bank",
    html: "<h1>Account created successfully.</h1>",
    text: "Thank you for banking with us.",
  };

  try {
    if (error) return res.status(400).send(error.details[0].message);
    if (await userModel.findOne({ email: body.email }))
      return res.status(403).send("User already exists");

    const user = new userModel(body);
    user.accountnumber = await accountNumberGenerator();
    user.password = await hash(body.password);
    const result = await user.save();
    const accessToken = user.authenticate();
    if (result) {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ accessToken: accessToken });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
