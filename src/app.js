const express = require("express");
const connectDB = require("./config/database");
const app = express();

const userModel = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new userModel({
    firstName: "Sunny",
    lastName: "Singh",
    emailId: "sunny@gmail.com",
    age: 26
  });
  try {
    await user.save();
    res.send("user added successfully")
  } catch (err) {
    res.status(400).send("Got error " + err.message);
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
