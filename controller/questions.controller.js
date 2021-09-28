const { questions, questionsInterest } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

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
}

module.exports = QuestionsController;
