const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionReqModel = require("../models/connectionRequest");
const userModel = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "uninterested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      //Check if there is any existing connectionReq
      const existingConnections = await connectionReqModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnections) {
        return res
          .status(400)
          .send({ message: "Connection request already exists" });
      }

      //Check user present in DB,then only send connection
      const isUserPresent = await userModel.findById(toUserId);
      if (!isUserPresent) {
        return res.status(400).json({ message: "User not found" });
      }

      const connectionSentData = new connectionReqModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionSentData.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${isUserPresent.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      //if the connection send should be interested only
      // status: accepted or rejected
      // touserid = loggedinuser.requestid
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedReviewStatus = ["accepted", "rejected"];
      if (!allowedReviewStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const connectionRequest = await connectionReqModel.findOne({
        fromUserId: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection ${status} successfully`, data });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;
