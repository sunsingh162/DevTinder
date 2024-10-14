const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 30,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 12,
      maxLength: 30,
      validate(value) {
        if(!validator.isEmail(value)){
            throw new Error("Email id is not valid: " + value)
        }
      }
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 25,
      validate(value) {
        if(!validator.isStrongPassword(value)){
            throw new Error("Your password is not strong: " + value)
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://kristalle.com/team/david-and-audrey-lloyd/dummy-profile-pic/",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid: " + value)
            }
          }
    },
    about: {
      type: String,
      default: "This is default bio of user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
