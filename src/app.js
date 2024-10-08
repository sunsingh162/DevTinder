const express = require("express");

const app = express();

app.get(
  "/user",
  (req, res,next) => {
    console.log("Handling the route Handler 1");
    next();
    // res.send("Response 1");
  },
  (req, res, next) => {
    console.log("Handling the route Handler 2");
    next()
    // res.send("Response 2");
  },
  (req, res, next) => {
    console.log("Handling the route Handler 3");
    next()
    // res.send("Response 3");
  }
);

app.listen(3000, () => {
  console.log("Server is successfully listening to port 3000");
});
