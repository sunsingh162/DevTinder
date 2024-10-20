const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionReqModel = require("../models/connectionRequest");
const userModel = require("../models/user");

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

    const data = acceptedConnections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    if (!data) {
      throw new Error("No Connections found");
    }
    res.json({
      message: "All Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // LoggedInuser should see the profile of users except
    // 1) his own profile
    // 2) the profile to which he has sent connection to
    // 3) the profile which he has ignored
    // 4) the profile from which he has got the request

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const allConnectionStatusOfLoggedInUser = await connectionReqModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });
    const hideuserProfile = new Set();
    allConnectionStatusOfLoggedInUser.map(
      (connection) => (
        hideuserProfile.add(connection.fromUserId),
        hideuserProfile.add(connection.toUserIdUserId)
      )
    );
    const showUsersProfileInFeed = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideuserProfile) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ message: "Fetched feed Users", data: showUsersProfileInFeed });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
