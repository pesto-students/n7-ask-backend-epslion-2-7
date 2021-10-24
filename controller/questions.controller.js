const { questions, questionsInterest, likes, interestModel, userModel } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");
const MetaData = require("../util/metaData")
const {verifyToken}  = require("../service/tokenHandler")
class QuestionsController {
  /**
   * @method
   * @description here user will ask questions
   * @return object : Http response
   * @param req
   */
  static addQuestions = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const { question, interest, expertId } = JSON.parse(req.body);
      const questionData = await questions.build({
        userId: id,
        question,
        expertId
      });
      try {
        await questionData.validate();
      } catch (error) {
        let errorResponse = error.errors.map((val) => ({
          field: val.path,
          message: val.message,
        }));
        return responseTemplate(400, false, ` ${error.message}`, errorResponse);
      }
      await questionData.save();
      let questionInterest = interest.map((val) => ({
        questionId: questionData.id,
        interestId: val,
      }));
      await questionsInterest.bulkCreate(questionInterest);
      return responseTemplate(200, true, "Question Added", questionData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };

  static getQuestions = async (req) => {
    try {
      const questionId = req.pathParameters.questionId
      const questionObject = await questions.findAll({
        where: {
          id: questionId,
        },
        include: [
          {
            model: interestModel,
            attributes: ["id", "name"],
          },
          {
            model: userModel,
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
              userId: verifyToken(req.headers.authorization.split(" ")[1]).id,
              like: 1,
            },
          });
          localQuestion.isUserLiked = like.length > 0;
        }
        localQuestion = { ...localQuestion, ...meta };
        feedData.push(localQuestion);
      }
      return responseTemplate(200, true, "question data", feedData);
    } catch (error) {
      return responseTemplate(400, false, error.message, []);
    }
  };



}

module.exports = QuestionsController;
