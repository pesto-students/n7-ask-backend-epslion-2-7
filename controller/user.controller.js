const db = require("../model/index");
const { createToken, verifyToken } = require("../service/tokenHandler");
const { decryptPassword, encryptPassword } = require("../util/hashPassword");
const responseTemplate = require("../util/responseTemplate");
const MetaData = require("../util/metaData")
const UserModel = db.userModel;
const likes = db.likes;
const comments = db.comments;
const answers = db.answers;
const questions = db.questions;
const interestModel = db.interestModel

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
      const userData = {
        "id": userDetails.id,
        "name": userDetails.name,
        "email": userDetails.email,
        "profilePic": userDetails.profilePic,
        "coverPic": userDetails.coverPic,
        "reputation": userDetails.reputation,
      }
      return responseTemplate(
        200,
        true,
        "user created",
        { token: `Bearer ${createToken({ id: userDetails.id })}`, ...userData }
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
      const userData = {
        "id": userDetails[0].id,
        "name": userDetails[0].name,
        "email": userDetails[0].email,
        "profilePic": userDetails[0].profilePic,
        "coverPic": userDetails[0].coverPic,
        "reputation": userDetails[0].reputation,
      }
      return responseTemplate(200, true, "user data fetched", userData);
    } catch (error) {
      return responseTemplate(400, false, error.message, []);
    }
  };

  static getUserAnswers = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const answerData = await answers.findAll({
        where: {
          userId: id,
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            attributes: ["id", "name", "profilePic"],
          },
        ],
      });

      let feedData = [];
      for (let i = 0; i < answerData.length; i++) {
        let localAnswer = {};
        localAnswer.id = answerData[i].id;
        localAnswer.answer = answerData[i].comment;
        localAnswer.userId = answerData[i].userId;
        localAnswer.userName = answerData[i].user.name;
        localAnswer.profilePic = answerData[i].user.profilePic;
        localAnswer.questionId = answerData[i].questionId;
        const meta = await MetaData(answerData[i], false);
        if (req.headers.authorization !== undefined) {
          const like = await likes.findAll({
            where: {
              typeId: answerData[i].id,
              type:"answer",
              userId: id,
              like: 1,
            },
          });
          localAnswer.isUserLiked = like.length > 0;
        }
        localAnswer = { ...localAnswer, ...meta };
        feedData.push(localAnswer);
      }
      return responseTemplate(200, true, "User Answer data", feedData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  }

  static getUserQuestions = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const questionObject = await questions.findAll({
        where: {
          userId: id,
        },
        include: [
          {
            model: interestModel,
            attributes: ["id", "name"],
          },
          {
            model: UserModel,
            attributes: ["id", "name", "profilePic"],
          },
        ],
      });
      let feedData = [];
      for (let i = 0; i < questionObject.length; i++) {
        let localQuestion = {};
        localQuestion.id = questionObject[i].id;
        localQuestion.question = questionObject[i].question;
        localQuestion.userId = questionObject[i].user.id;
        localQuestion.userName = questionObject[i].user.name;
        localQuestion.profilePic = questionObject[i].user.profilePic;
        localQuestion.interests = questionObject[i].interests.map((val) => ({
          id: val.id,
          name: val.name,
        }));
        const meta = await MetaData(questionObject[i]);
        if (req.headers.authorization !== undefined) {
          const like = await likes.findAll({
            where: {
              typeId: questionObject[i].id,
              type:"question",
              userId: id,
              like: 1,
            },
          });
          localQuestion.isUserLiked = like.length > 0;
        }
        localQuestion = { ...localQuestion, ...meta };
        feedData.push(localQuestion);
      }
      return responseTemplate(200, true, "user Feed", feedData);
    } catch (error) {
      return responseTemplate(400, false, error.message, []);
    }

  }

  static getUserComments = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const commentsData = await comments.findAll({
        where: {
          userId: id,
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            attributes: ["id", "name", "profilePic"],
          },
        ],
      });

      let feedData = [];
      for (let i = 0; i < commentsData.length; i++) {
        let localAnswer = {};
        localAnswer.id = commentsData[i].id;
        localAnswer.answer = commentsData[i].comment;
        localAnswer.userId = commentsData[i].userId;
        localAnswer.userName = commentsData[i].user.name;
        localAnswer.profilePic = commentsData[i].user.profilePic;
        localAnswer.questionId = commentsData[i].questionId;
        const meta = await MetaData(commentsData[i], false);
        if (req.headers.authorization !== undefined) {
          const like = await likes.findAll({
            where: {
              typeId: commentsData[i].id,
              userId: id,
              type:"comment",
              like: 1,
            },
          });
          localAnswer.isUserLiked = like.length > 0;
        }
        localAnswer = { ...localAnswer, ...meta };
        feedData.push(localAnswer);
      }
      return responseTemplate(200, true, "User comment data", feedData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  }

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
      if (userData["password"]) {
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
      const userData = {
        "id": userDetails[0].id,
        "name": userDetails[0].name,
        "email": userDetails[0].email,
        "profilePic": userDetails[0].profilePic,
        "coverPic": userDetails[0].coverPic,
        "reputation": userDetails[0].reputation,
      }
      return responseTemplate(
        200,
        true,
        "Successfully logged in ",
        { token: `Bearer ${createToken({ id: userDetails[0].id })}`, ...userData }
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
