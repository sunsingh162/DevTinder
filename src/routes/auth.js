const express = require("express");
const { validateData } = require("../utils/validation");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//Signup user
authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Login User by Email and password
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId: emailId });
    const { _id } = user;

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT Token
      const token = await user.getJWT();
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Logout user
authRouter.post("/logout", (req, res) => {
    //Just make token as null to logout
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully")
});

module.exports = authRouter;
