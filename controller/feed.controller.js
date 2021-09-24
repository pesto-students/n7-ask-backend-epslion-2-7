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
const randomize = require("../util/randomSort");

class FeedController {
  /**
   * @method
   * @description here user will questions feed
   * @return object : Http response
   * @param req
   */
  static getFeed = async (req) => {
    try {
      const query = req.queryStringParameters;
      let params = {
        page: 1,
        filter: null,
        interests: null,
      };
      if (query.hasOwnProperty("page")) params.page = query.page;
      if (query.hasOwnProperty("filter")) params.filter = query.filter;
      if (query.hasOwnProperty("interests")) params.interests = query.interests;
      let allInterests = await this.interestFilter(params, req);
      const questionObject = await questions.findAll({
        offset: (params.page - 1) * 10,
        limit: 10,
        include: [
          {
            model: interestModel,
            attributes: ["id", "name"],
            where: {
              id: allInterests,
            },
          },
          {
            model: userModel,
            attributes: ["id", "name", "profilePic"],
          },
        ],
      });

      let feedData = [];
      for (let i = 0; i < questionObject.length; i++) {
        let localQuestion = {};
        localQuestion.id = questionObject[i].id;
        localQuestion.question = questionObject[i].question;
        localQuestion.userId = questionObject[i].user.id;
        localQuestion.userName = questionObject[i].user.name;
        localQuestion.profilePic = questionObject[i].user.profilePic;
        localQuestion.interests = questionObject[i].interests.map((val) => ({
          id: val.id,
          name: val.name,
        }));
        const meta = await this.metaData(questionObject[i]);
        localQuestion = { ...localQuestion, ...meta };
        feedData.push(localQuestion);
      }

      if (params.filter) {
        let filter = params.filter;
        switch (filter) {
          case "like":
            feedData = feedData.sort((a, b) => a.likes - b.likes);
            break;
          case "views":
            feedData = feedData.sort((a, b) => a.views - b.views);
            break;
        }
      }
      return responseTemplate(200, true, "user Feed", feedData);
    } catch (error) {
      return responseTemplate(400, false, error.message, []);
    }
  };

  static async interestFilter(query, loggedInId) {
    const interest = {
      nature: 1,
      technology: 2,
      movies: 3,
      space: 4,
      business: 5,
      travel: 6,
      health: 9,
      books: 10,
      science: 11,
      fashion: 12,
    };

    if (query.interests) {
      return query.interests.map((val) => interest[val.toLowerCase()]);
    } else if (
      query.filter === "random" ||
      loggedInId.requestContext.authorizer === undefined
    ) {
      return Object.values(randomize(interest));
    } else {
      const userInterest = await userInterestModel.findAll({
        where: {
          userId: loggedInId.requestContext.authorizer.lambda.id,
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
      return Object.keys(
        Object.fromEntries(
          Object.entries(interestData).sort((a, b) => a.followers - b.followers)
        )
      );
    }
  }

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
        like: 1,
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
