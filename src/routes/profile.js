const express = require("express");
const {userAuth} = require("../middlewares/auth")

const profileRouter = express.Router();

//Get profile of loggedIn User
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`Welcome, ${user.firstName} ${user.lastName}`);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
