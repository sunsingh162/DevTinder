const express = require("express");
const connectDB = require("./config/database");
const app = express();
require("dotenv").config();
const cookiesParser = require("cookie-parser");
const cors = require("cors")

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB connected Successfully");
    app.listen(process.env.port, () => {
      console.log("Server is successfully listening to port 3000");
    });
  })
  .catch((err) => {
    console.log("Connection not established");
  });
