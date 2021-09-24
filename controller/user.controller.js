const db = require("../model/index");
const { createToken, verifyToken } = require("../service/tokenHandler");
const { decryptPassword, encryptPassword} = require("../util/hashPassword");
const responseTemplate = require("../util/responseTemplate");
const UserModel = db.userModel;

class UserController {
  /**
   * @method
   * @description User is created by getting data from request body
   * @return object : Http response,
   * @param req
   */
  static creatUserDetails = async (req) => {
    try {
      let { name, email, password } = JSON.parse(req.body);
      const isEmailExist = await UserModel.findAll({
        where: {
          email,
        },
      });
      if (isEmailExist.length > 0) {
        return responseTemplate(
          400,
          false,
          `user with email Address is already exist`,
          []
        );
      }
      const userDetails = await UserModel.build({
        name,
        email,
        password,
      });
      try {
        await userDetails.validate();
      } catch (error) {
        let errorResponse = error.errors.map((val) => ({
          field: val.path,
          message: val.message,
        }));
        return responseTemplate(400, false, ` ${error.message}`, errorResponse);
      }
      await userDetails.save();
      return responseTemplate(
        200,
        true,
        "user created",
        `Bearer ${createToken({ id: userDetails.id })}`
      );
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };

  /**
   * @method
   * @description User details are fetched and returned
   * @return object : Http response,
   * @param req
   */
  static getUserDetails = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const userDetails = await UserModel.findAll({
        where: {
          id,
        },
      });
      if (!userDetails) {
        return responseTemplate(400, false, "No data found", []);
      }
      const userData ={
        "id": userDetails[0].id,
        "name": userDetails[0].name,
        "email": userDetails[0].email,
        "profilePic":  userDetails[0].profilePic,
        "coverPic": userDetails[0].coverPic,
        "reputation": userDetails[0].reputation,
      }
      return responseTemplate(200, true, "user data fetched", userData);
    } catch (error) {
      return responseTemplate(400, false, error.message, []);
    }
  };

  /**
   * @method
   * @description User details are updated
   * @return object : Http response,
   * @param req
   */
  static updateUserDetails = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const userData = JSON.parse(req.body);
      if(userData["password"]){
        delete userData["password"]
      }
      return UserModel.update(userData, { where: { id } })
        .then((success) => {
          return responseTemplate(200, true, "Data Update", success);
        })
        .catch((error) => {
          let errorResponse = error.errors.map((val) => ({
            field: val.path,
            message: val.message,
          }));
          return responseTemplate(
            400,
            false,
            ` ${error.message}`,
            errorResponse
          );
        });
    } catch (error) {
      return responseTemplate(400, false, `${error.message}`, []);
    }
  };

  /**
   * @method
   * @description users cred is used for logging in.
   * @return object : Http response,
   * @param req
   */
  static userLogin = async (req) => {
    try {
      let { email, password } = JSON.parse(req.body);
      const userDetails = await UserModel.findAll({
        where: {
          email,
        },
      });
      if (!userDetails) {
        return responseTemplate(401, false, "Invalid Credentials", []);
      }
      let isVerified = decryptPassword(password, userDetails[0].password);

      if (!isVerified) {
        return responseTemplate(401, false, "Invalid Credentials", []);
      }
      return responseTemplate(
        200,
        true,
        "Successfully logged in ",
        `Bearer ${createToken({ id: userDetails[0].id })}`
      );
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`);
    }
  };

  /**
   * @method
   * @description users password can be reset.
   * @return object : Http response,
   * @param req
   */
  static resetUserPassword = async (req) => {
    try {
      let { email, password1, password2 } = JSON.parse(req.body);
      const isEmailExist = await UserModel.findAll({
        where: {
          email,
        },
      });
      if (isEmailExist.length === 0) {
        return responseTemplate(
          400,
          false,
          `user with email Address does not exist`,
          []
        );
      }

      if (password1 !== password2) {
        return responseTemplate(400, false, `both password does not match`, []);
      }

      return UserModel.update(
        {
          password: encryptPassword(password2),
        },
        {
          where: {
            email,
          },
        }
      )
        .then((success) => {
          return responseTemplate(200, true, "Data Update", success);
        })
        .catch((error) => {
          let errorResponse = error.errors.map((val) => ({
            field: val.path,
            message: val.message,
          }));
          return responseTemplate(
            400,
            false,
            ` ${error.message}`,
            errorResponse
          );
        });
    } catch (error) {
      return responseTemplate(400, false, error.message, []);
    }
  };
}

module.exports = UserController;
