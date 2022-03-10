/**
 * User Validation Rules
 */
const { body } = require("express-validator");
const models = require("../models");

const createUser = [
  body("email")
    .exists()
    .isEmail()
    .custom(async (value) => {
      const user = await new models.User({ email: value }).fetch({
        require: false,
      });
      if (user) {
        return Promise.reject("Email already registered.");
      }

      return Promise.resolve();
    }),
  body("password").exists().isString().isLength({ min: 6 }),
  body("first_name").exists().isString().isLength({ min: 3 }),
  body("last_name").exists().isString().isLength({ min: 3 }),
];

const loginUser = [
  body("email").exists().isEmail(),
  body("password").exists().isString().isLength({ min: 6 }),
];

module.exports = {
  createUser,
  loginUser,
};
