const { views } = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

class ViewController {
  /**
   * @method
   * @description here views will increase for question, answers or comment
   * @return object : Http response
   * @param req
   */
  static increaseViewCount = async (req) => {
    try {
      const { typeId, type } = JSON.parse(req.body);
      const viewRow = await views.findAll({
        where: {
          typeId,type
        },
      });
      if (viewRow.length > 0) {
        return views
          .increment("views", { by: 1, where: { typeId } })
          .then((success) => {
            return responseTemplate(200, true, "Data Update", success);
          })
          .catch((error) => {
            return responseTemplate(400, false, ` ${error.message}`, error);
          });
      } else {
        let id;
        if (req.requestContext.authorizer)
          id = req.requestContext.authorizer.lambda.id;
        else id = 1;
        const viewData = await views.build({
          userId: id,
          type,
          typeId,
          views: 1,
        });
        try {
          await viewData.validate();
        } catch (error) {
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
        await viewData.save();
        return responseTemplate(200, true, "view increased", {viewData});
      }
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };
}

module.exports = ViewController;
