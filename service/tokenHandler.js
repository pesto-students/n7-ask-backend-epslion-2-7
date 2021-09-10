const jwt = require("jsonwebtoken");

/**
 * @function
 * @description Token is generated using payload.
 * @return object : token,
 * @param payload
 */
function createToken(payload) {
  try {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "24h",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
/**
 * @function
 * @description Token is verified and payload is return.
 * @return object : payload,
 * @param token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new Error(error.message);
  }
}

const tokenService = {
  createToken,
  verifyToken,
};
module.exports = tokenService;
