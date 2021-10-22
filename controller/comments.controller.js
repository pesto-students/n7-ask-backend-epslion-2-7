const { comments, likes, userModel } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");
const MetaData = require("../util/metaData");

class CommentsController {
  /**
   * @method
   * @description here user will add an comments on questions, answer or comments
   * @return object : Http response
   * @param req
   */
  static addComments = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const { type, typeId, comment } = JSON.parse(req.body);
      const commentData = await comments.build({
        userId: id,
        type,
        typeId,
        comment,
      });
      try {
        await commentData.validate();
      } catch (error) {
        let errorResponse = error.errors.map((val) => ({
          field: val.path,
          message: val.message,
        }));
        return responseTemplate(400, false, ` ${error.message}`, errorResponse);
      }
      await commentData.save();
      return responseTemplate(200, true, "Answer Added", commentData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };

  /**
   * @method
   * @description here user will get comment for questions, answer or comments
   * @return object : Http response
   * @param req
   */
  static getComments = async (req) => {
    try {
      const typeId = req.pathParameters.id
      const type = req.pathParameters.type
      const commentData = await comments.findAll({
        where: {
          typeId,
          type
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
      for (let i = 0; i < commentData.length; i++) {
        let localComment = {};
        localComment.id = commentData[i].id;
        localComment.comment = commentData[i].comment;
        localComment.userId = commentData[i].userId;
        localComment.userName = commentData[i].user.name;
        localComment.profilePic = commentData[i].user.profilePic;
        const meta = await MetaData(commentData[i], false);
        localComment = { ...localComment, ...meta };
        feedData.push(localComment);
      }
      return responseTemplate(200, true, "Comment Data", feedData);
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = CommentsController;
