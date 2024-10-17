const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

//Get profile of loggedIn User
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`Welcome, ${user.firstName} ${user.lastName}`);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Editing is not allowed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).map(
      (field) => (loggedInUser[field] = req.body[field])
    );
    await loggedInUser.save();
    //   res.send("Profile updated successfully")   //Both can be used but later is good practice
    res.json({ message: "Profile updated successfully", data: loggedInUser }); //Good practice in industry
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//TODO: Edit password


module.exports = profileRouter;
