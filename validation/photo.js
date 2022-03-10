/**
 * Photo Rules
 */
const { body } = require("express-validator");

const uploadRules = [
  body("title").exists().isString().isLength({ min: 3 }),
  body("url").exists().isString().isURL(),
  body("comment").optional().isString().isLength({ min: 3 }),
];

const updateRules = [
  body("title").optional().isString().isLength({ min: 3 }),
  body("url").optional().isString().isURL(),
  body("comment").optional().isString().isLength({ min: 3 }),
];

module.exports = { uploadRules, updateRules };
