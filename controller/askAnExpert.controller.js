const { userModel, interestModel, questions, likes} = require("../model/index");
const responseTemplate = require("../util/responseTemplate");
const MetaData = require("../util/metaData");

class AskAnExpertController {
  /**
   * @method
   * @description here user will get experts
   * @return object : Http response
   * @param req
   */
  static getExpertsList = async (req) => {
    try {
      const userDetails = await userModel.findAll({
        order: [["reputation", "DESC"]],
        attributes: ["id", "name", "email", "profilePic", "reputation"],
        include: [
          {
            model: interestModel,
            attributes: ["id", "name"],
          },
        ],
      });
      return responseTemplate(200, true, "Experts details", userDetails);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };

  /**
   * @method
   * @description here experts will get questions
   * @return object : Http response
   * @param req
   */
  static getExpertsQuestions = async (req) => {
    try {
      const questionObject = await questions.findAll({
        where:{
          expertId:req.requestContext.authorizer.lambda.id
        },
        order: [["createdAt", "DESC"]],
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
        const questionInterests = await questionsInterest.findAll({
          where: {
            questionId: localQuestion.id,
          },
          include: [
            {
              model: interestModel,
              attributes: ["id", "name"],
            },
          ],
        });
        localQuestion.interests = questionInterests.map((val) => ({
          id: val.interest.id,
          name: val.interest.name,
        }));
        const meta = await MetaData(questionObject[i]);
        if(req.requestContext.authorizer !== undefined){
          const like  = await likes.findAll({
            where: {
              typeId: questionObject[i].id,
              userId:req.requestContext.authorizer.lambda.id ,
              like: 1,
            },
          });
          localQuestion.isUserLiked = like.length > 0;
        }
        localQuestion = { ...localQuestion, ...meta };
        feedData.push(localQuestion);
      }

      return responseTemplate(200, true, "Experts details", feedData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = AskAnExpertController;
