const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const userValidation = require("../validation/user");
const auth = require("../middlewares/auth");

// Resten av routes
router.use("/albums", auth.validateJwtToken, require("./albums"));
router.use("/photos", auth.validateJwtToken, require("./photos"));

// POST a user (register new)
router.post("/register", userValidation.createUser, authController.register);

// Login a user
router.post("/login", userValidation.loginUser, authController.login);

// Get new access token for user
router.post("/refresh", authController.refresh);

module.exports = router;
