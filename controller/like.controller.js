const { likes } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

class LikeController {
  /**
   * @method
   * @description here user will like / unlike question, answers or comment
   * @return object : Http response
   * @param req
   */
  static toggleLike = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const { type, typeId, like } = JSON.parse(req.body);
      return likes
        .findOrCreate({
          where: {
            typeId,
          },
          defaults: {
            userId: id,
            type,
            like,
          },
        })
        .then((success) => {
          return responseTemplate(200, true, "Data Update", success);
        })
        .catch((error) => {
          console.log(error);
          return responseTemplate(400, false, ` ${error.message}`, error);
        });
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = LikeController;
