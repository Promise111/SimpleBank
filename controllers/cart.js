const Joi = require("joi");

exports.cart = async (req, res) => {
    return res.render("cart");
};

exports.add = async (req, res) => {
  const body = req.body;
  const { error } = validator(body);
  console.log(body);
  res.redirect("/cart");
};

exports.remove = async (req, res) => {};

function validator(obj) {
  const schema = Joi.object({
    quantity: Joi.number().required,
  });

  return schema.validate(obj);
}
