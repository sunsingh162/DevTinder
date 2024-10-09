const express = require("express");

const app = express();
const { userAuth, adminAuth } = require("./middlewares/auth");

app.get("/user", userAuth);

app.get("/admin", adminAuth, (req, res) => {
  res.send("Admin data sent");
});
app.get("/user/data", (req, res) => {
  res.send("Data sent");
});

//Way to gracefully handle errors
app.use("/", (err,req,res,next) => {
    try{
        //write ur logic
    } catch(err){
        res.status(500).send("Something went wrong")
    }
})

app.listen(3000, () => {
  console.log("Server is successfully listening to port 3000");
});
