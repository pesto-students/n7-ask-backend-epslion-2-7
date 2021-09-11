const { verifyToken } = require("../service/tokenHandler");

class AuthController {
  /**
   * @method
   * @description this method is used for authenticating all protected routes
   * @param req
   * @return object : isAuthorized: true, context: tokenData,
   */
  static authentication = (req) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenData = verifyToken(token);
      return {
        isAuthorized: true,
        context: tokenData,
      };
    } catch (error) {
      return {
        isAuthorized: false,
        context: "Invalid Credentials",
      };
    }
  };
}

module.exports = AuthController;
