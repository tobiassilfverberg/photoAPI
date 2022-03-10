/**
 * Auth Controller
 */

const bcrypt = require("bcrypt");
const debug = require("debug")("photoAPI:auth_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");
const jwt = require("jsonwebtoken");

/**
 * Login a user, sign a JWT token and return it
 *
 * POST /login
 * {
 *  "username": "",
 *  "password": ""
 * }
 */
const login = async (req, res) => {
  // login in the user
  const user = await models.User.login(req.body.email, req.body.password);
  if (!user) {
    return res.status(401).send({
      status: "fail",
      data: "Authentication failed",
    });
  }

  // construct jwt payload
  const payload = {
    sub: user.get("email"),
    user_id: user.get("id"),
    name: user.get("first_name") + " " + user.get("last_name"),
  };

  // sign payload and get access token
  const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });

  // sign payload and get refresh token
  const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });

  // respond with the access-token
  return res.send({
    status: "success",
    data: {
      // access-token here
      access_token,
      refresh_token,
    },
  });
};

/**
 * Validate refresh token and issue a new JWT token and return it
 *
 * POST /refresh
 * {
 *  "token": "",
 * }
 */
const refresh = (req, res) => {
  // make sure authorization header exists, otherwise bail
  if (!req.headers.authorization) {
    debug("Autorization header missing");

    return res.status(401).send({
      status: "fail",
      data: "Authorization required",
    });
  }

  // split authorization header into "authSchema token"
  const [authSchema, token] = req.headers.authorization.split(" ");
  if (authSchema.toLowerCase() !== "bearer") {
    return res.status(401).send({
      status: "fail",
      data: "Authorization required",
    });
  }

  // validate the refresh token (check signature and expiry date)
  try {
    // verify token using the refresh token secret
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // construct payload
    // remove `iat` and `exp` from refresh token payload
    delete payload.iat;
    delete payload.exp;

    // sign payload and get access token
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
    });

    // send the access token to the client
    return res.send({
      status: "success",
      data: {
        access_token,
      },
    });
  } catch (error) {
    return res.status(401).send({
      status: "fail",
      data: "Invalid token",
    });
  }
};

/**
 * Register a new user
 *
 * POST /regiser
 */
const register = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  console.log("The validated data:", validData);

  // generate a hash of `validData.password`
  // and overwrite `validData.password` with the generated hash
  try {
    validData.password = await bcrypt.hash(
      validData.password,
      models.User.hashSaltRounds
    );
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when hashing the password.",
    });
    throw error;
  }

  try {
    const user = await new models.User(validData).save();
    debug("Created new user successfully: %O", user);

    res.send({
      status: "success",
      data: {
        email: user.get("email"),
        first_name: user.get("first_name"),
        last_name: user.get("last_name"),
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Exception thrown in database when creating a new user.",
    });
  }
};

module.exports = {
  login,
  register,
  refresh,
};
