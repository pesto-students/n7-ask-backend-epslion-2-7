const { likes, userModel } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

class ReputationController {
  static reputationCalculation = async (req) => {
    const { userId, typeId, type } = JSON.parse(req.body);
    const allLikes = await likes.count({
      where: {
        typeId,
        type,
        like: 1,
      },
    });
    if (
      allLikes !== 0 &&
      allLikes % 10 === 0 &&
      ["question", "answers"].includes(type)
    ) {
      userModel
        .increment("reputation", { by: 1, where: { id: userId } })
        .then((success) => {
          return responseTemplate(200, true, "Reputation increased", success);
        })
        .catch((error) => {
          return responseTemplate(400, false, ` ${error.message}`, error);
        });
    } else {
      return responseTemplate(200, true, "Not enough likes for reputation");
    }
  };
}

module.exports = ReputationController;
