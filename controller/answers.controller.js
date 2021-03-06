const { answers, comments, userModel, likes } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");
const MetaData = require("../util/metaData");
const { verifyToken } = require("../service/tokenHandler");
class AnswersController {
  /**
   * @method
   * @description here user will answer an question
   * @return object : Http response
   * @param req
   */
  static addAnswer = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const { answer, questionId } = JSON.parse(req.body);
      const answerData = await answers.build({
        userId: id,
        answer,
        questionId,
      });
      try {
        await answerData.validate();
      } catch (error) {
        let errorResponse = error.errors.map((val) => ({
          field: val.path,
          message: val.message,
        }));
        return responseTemplate(400, false, ` ${error.message}`, errorResponse);
      }
      await answerData.save();
      return responseTemplate(200, true, "Answer Added", answerData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };

  /**
   * @method
   * @description here user will get answers for questions
   * @return object : Http response
   * @param req
   */
  static getAnswers = async (req) => {
    try {
      const questionId = req.pathParameters.questionId;
      const answerData = await answers.findAll({
        where: {
          questionId,
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: userModel,
            attributes: ["id", "name", "profilePic"],
          },
        ],
      });
      let feedData = [];
      for (let i = 0; i < answerData.length; i++) {
        let localComment = {};
        localComment.id = answerData[i].id;
        localComment.answer = answerData[i].answer;
        localComment.userId = answerData[i].userId;
        localComment.userName = answerData[i].user.name;
        localComment.profilePic = answerData[i].user.profilePic;
        localComment.questionId = answerData[i].questionId;
        const meta = await MetaData(answerData[i], false);
        if (req.headers.authorization !== undefined) {
          const like = await likes.findAll({
            where: {
              typeId: answerData[i].id,
              type:"answer",
              userId: verifyToken(req.headers.authorization.split(" ")[1]).id,
              like: 1,
            },
          });
          localComment.isUserLiked = like.length > 0;
        }
        localComment = { ...localComment, ...meta };
        feedData.push(localComment);
      }
      return responseTemplate(200, true, "Answer Data", feedData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = AnswersController;
