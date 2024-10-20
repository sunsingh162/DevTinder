const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionReqModel = require("../models/connectionRequest");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReqRecieved = await connectionReqModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);
    console.log(connectionReqRecieved);
    if (!connectionReqRecieved) {
      return res.status(400).json({ message: "Connection request not found" });
    }
    res.json({
      message: "Data fetched successfully",
      data: connectionReqRecieved,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const acceptedConnections = await connectionReqModel
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

      const data = acceptedConnections.map(row => {
        if(row.fromUserId._id.equals(loggedInUser._id)){
            return row.toUserId
        }
        return row.fromUserId
      })
    if (!data) {
      throw new Error("No Connections found");
    }
    res.json({
      message: "All Connections fetched successfully",
      data
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
