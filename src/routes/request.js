const express = require("express");
const {userAuth} = require("../middlewares/auth")

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Connection sent successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = requestRouter;
