const express = require("express");
const connectDB = require("./config/database");
const app = express();

const userModel = require("./models/user");
const { validateData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookiesParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const {userAuth} = require("./middlewares/auth")

app.use(express.json());
app.use(cookiesParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId: emailId });
    const { _id } = user;

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT Token
      const token = await jwt.sign({ _id }, "DevTinder@6798", { expiresIn : "1d"});
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000)});

      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Get profile of loggedIn User
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`Welcome, ${user.firstName} ${user.lastName}`);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req,res) => {
  try {
    res.send("Connection sent successfully")
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

connectDB()
  .then(() => {
    console.log("DB connected Successfully");
    app.listen(3000, () => {
      console.log("Server is successfully listening to port 3000");
    });
  })
  .catch((err) => {
    console.log("Connection not established");
  });
