const express = require("express");
const connectDB = require("./config/database");
const app = express();

const userModel = require("./models/user");
const { validateData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookiesParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
      const token = await jwt.sign({ _id }, "DevTinder@6798");
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token);

      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Get profile of loggedIn User
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    //Validate my token
    const decodedMessage = await jwt.verify(token, "DevTinder@6798");
    const { _id } = decodedMessage;
    const user = await userModel.findById({ _id });
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(`Welcome, ${user.firstName} ${user.lastName}`);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Get User By Email
app.get("/user", async (req, res) => {
  try {
    const { emailId } = req.body;
    const users = await userModel.findOne({ emailId: emailId });
    if (users.length === 0) {
      res.status(400).send("Something went wrong");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API- get all users from database
app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete User data
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await userModel.findByIdAndDelete({ _id: userId });
    // await userModel.findByIdAndDelete(userId)   // also can write like this
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update User data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "photoUrl",
      "about",
      "skills",
    ];
    const isAllowedUpdates = Object.keys(data).every((field) =>
      ALLOWED_UPDATES.includes(field)
    );
    if (!isAllowedUpdates) {
      throw new Error("Can't update field");
    }
    if (data.skills.length > 8) {
      throw new Error("Cant update the field");
    }
    const user = await userModel.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("user udpated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});

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
