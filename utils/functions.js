const { userModel } = require("../models/user");
const nodemailer = require("nodemailer");

exports.accountNumberGenerator = async () => {
  const userCount = await userModel.find().count();
  const rand = randomNumbers(2);
  const timeStamp = new Date().getTime().toString();
  const result =
    String(userCount) +
    rand +
    new Date().getSeconds().toString().substring(0, 1) +
    timeStamp;
  return result.substring(0, 10);
};

function randomNumbers(length) {
  const numbers = "1234567890";
  // const length = 2;
  var result = "";

  for (let i = 0; i <= length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
}

exports.transport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: "promiseihunna@gmail.com",
    pass: "y7CkRUtAQTb806mh",
  },
});

module.exports.randomNumbers = randomNumbers;
