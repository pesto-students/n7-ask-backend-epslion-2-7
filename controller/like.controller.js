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
      const likeRow = await likes.findAll({
        where: {
          typeId,
        },
      });
      if (likeRow.length > 0) {
        return likes
          .update(
            {
              like,
            },
            { where: { typeId } }
          )
          .then((success) => {
            return responseTemplate(200, true, "Data Update", success);
          })
          .catch((error) => {
            return responseTemplate(400, false, ` ${error.message}`, error);
          });
      } else {
        const likeData = await likes.build({
          userId: id,
          type,
          like,
          typeId,
        });
        try{
          await likeData.validate();
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
        await likeData.save();
        return responseTemplate(200, true, "Like updated", likeData);
      }
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = LikeController;
