/**
 * Authentication Middleware
 */

const debug = require("debug")("books:auth");
const jwt = require("jsonwebtoken");

/**
 * Validate JWT Token
 */
const validateJwtToken = (req, res, next) => {
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

  // verify token (and extract payload)
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
  } catch (error) {
    return res.status(401).send({
      status: "fail",
      data: "Authorization failed",
    });
  }
  next();
};

module.exports = {
  validateJwtToken,
};
