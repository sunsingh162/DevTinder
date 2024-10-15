const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not valid");
    }
    const decodedMessage = await jwt.verify(token, "DevTinder@6798");
    const { _id } = decodedMessage;
    const user = await userModel.findById({ _id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
