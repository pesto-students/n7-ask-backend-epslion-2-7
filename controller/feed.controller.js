const {
  questions,
  userInterestModel,
  questionsInterest,
  interestModel,
  userModel,
  answers,
  comments,
  likes,
  views,
} = require("../model/index");
const responseTemplate = require("../util/responseTemplate");

class FeedController {
  /**
   * @method
   * @description here user will questions feed
   * @return object : Http response
   * @param req
   */
  static getFeed = async (req) => {
    try {
      const id = req.requestContext.authorizer.lambda.id;
      const userInterest = await userInterestModel.findAll({
        where: {
          userId: id,
        },
        include: [
          {
            model: interestModel,
            attributes: ["name", "followers", "id"],
            required: true,
          },
        ],
      });

      const interestData = {};
      userInterest.map((val) => {
        interestData[val.interest.id] = {
          name: val.interest.name,
          followers: val.interest.followers,
        };
      });
      const sortedInterestData = Object.fromEntries(
        Object.entries(interestData).sort(([, a], [, b]) => {
          return a.followers - b.followers;
        })
      );
      const questionObject = await questions.findAll({
        offset: 0,
        limit: 10,
        include: [
          {
            model: interestModel,
            attributes: ["id", "name"],
            where: {
              id: Object.keys(sortedInterestData),
            },
          },
          {
            model: userModel,
            attributes: ["id", "name", "profilePic"],
          },
        ],
      });

      let feedData = [];

      for(let i =0 ; i < questionObject.length; i++){
        let localQuestion = {};
        localQuestion.id = questionObject[i].id;
        localQuestion.question = questionObject[i].question;
        localQuestion.userId = questionObject[i].user.id;
        localQuestion.userName = questionObject[i].user.name;
        localQuestion.profilePic = questionObject[i].user.profilePic;
        const meta = await this.metaData(questionObject[i]);
        localQuestion = {...localQuestion , ...meta}
        feedData.push(localQuestion);
      }
      return responseTemplate(200, true, "user Feed", feedData)
    } catch (error) {
      return responseTemplate(400, false, ` ${error.message}`, []);
    }
  };

  static async metaData(data) {
    let localAnswers = await answers.count({
      where: {
        questionId: data.id,
      },
    });

    let localComments = await comments.count({
      where: {
        typeId: data.id,
      },
    });

    let localLikes = await likes.count({
      where: {
        typeId: data.id,
      },
    });

    let localViews = await views.count({
      where: {
        typeId: data.id,
      },
    });
    return {
      answers: localAnswers,
      comments: localComments,
      likes: localLikes,
      views: localViews,
    };
  }
}

module.exports = FeedController;
