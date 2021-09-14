const { questions } = require("../model/index");
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
      const {question} = JSON.parse(req.body);
      const questionData = await questions.build({
        userId: id,
        question,
      });
      try{
        await questionData.validate();
      }
      catch (error){
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
      }
      await questionData.save();
      return responseTemplate(200, true, "Question Added", questionData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = QuestionsController;
