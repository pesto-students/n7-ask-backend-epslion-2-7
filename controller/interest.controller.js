const { userInterestModel } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

class InterestController {
  /**
   * @method
   * @description here user will add or edit interests
   * @return object : Http response
   * @param req
   */
  static addUserInterests = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const requestBody = JSON.parse(req.body);
      if (requestBody.length < 3) {
        return responseTemplate(
          400,
          false,
          "at least three interests are required to proceed",
          []
        );
      }
      let selectedInterest = requestBody.map((val) => ({
        userId: id,
        interestId: val,
      }));
      const interestDetails = await userInterestModel.bulkCreate(
        selectedInterest
      );
      return responseTemplate(200, true, "Interest Added", interestDetails);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = InterestController;
