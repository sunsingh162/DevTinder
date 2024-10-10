const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sunny881981:CwW6S4bvdyZufsLE@namastenodejs.tmnjx.mongodb.net/devTinder"
  );
};

module.exports = connectDB