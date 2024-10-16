const validator = require("validator");

const validateData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not Strong");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];
  const isAllowedEditFields = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isAllowedEditFields;
};

module.exports = { validateData, validateEditProfileData };
