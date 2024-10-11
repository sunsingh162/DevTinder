const express = require("express");
const connectDB = require("./config/database");
const app = express();

const userModel = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new userModel(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Got error " + err.message);
  }
});

//Get User By Email
app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const users = await userModel.findOne({ emailId: email });
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
app.get("/feed", async(req,res) => {
    try {
        const users = await userModel.find({})
        res.send(users)
    } catch(err){
        res.status(400).send('Something went wrong')
    }
})

//delete User data
app.delete("/user", async(req,res) => {
    const userId = req.body.userId
    try{
        await userModel.findByIdAndDelete({_id: userId})
        // await userModel.findByIdAndDelete(userId)   // also can write like this
        res.send('user deleted successfully')
    }catch(err){
        res.status(400).send('Something went wrong')
    }
})

//Update User data
app.patch("/user", async(req,res) => {
    const userId = req.body.userId
    const data = req.body
    try{
       const user= await userModel.findByIdAndUpdate(userId, data, {
            returnDocument: "before"
        })
        console.log(user);
        res.send("user udpated successfully")
    }catch(err){
        res.status(400).send('Something went wrong')
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
