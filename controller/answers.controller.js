const { answers, comments} = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

class AnswersController {
    /**
     * @method
     * @description here user will answer an question
     * @return object : Http response
     * @param req
     */
    static addAnswer= async (req) => {
        try {
            const id = req.requestContext.authorizer.lambda.id;
            const {answer,questionId} = JSON.parse(req.body);
            const answerData = await answers.build({
                userId: id,
                answer,
                questionId
            });
            try{
                await answerData.validate();
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
            const questionId = req.pathParameters.questionId
            const answerData = await answers.findAll({
                where:{
                    questionId
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
            });
            return responseTemplate(200, true, "Answer Added", answerData);
        } catch (error) {
            return responseTemplate(400, false, ` ${error.message}`, []);
        }
    };

}

module.exports = AnswersController;
