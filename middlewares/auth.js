const { verifyToken, userModel } = require("../models/user");

module.exports = (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!token)
      return res.status(401).json({message:"Access denied. No token provided."});
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
