const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "uninterested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //Check if fromUserId and toUserId are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send request to yourself");
  }
  next();
});

const connectionReqModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionReqModel;
