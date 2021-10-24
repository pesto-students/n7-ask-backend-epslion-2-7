const { questions, interestModel, userModel, answers, comments, likes, views} = require("../model/index");
const responseTemplate = require("../util/responseTemplate");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { verifyToken } = require("../service/tokenHandler");
class SearchController {
  static search = async (req) => {
    try {
      let query =  req.queryStringParameters
      let params = {
        page: 1,
        q: '',
      };
      if (query.hasOwnProperty("page")) params.page = query.page;
      if (query.hasOwnProperty("q")) params.q = query.q;

      const questionObject = await questions.findAll({
        where: {
          question: { [Op.like]: `%${params.q}%` },
        },
        offset: (params.page-1) * 10 ,
        limit: 10,
        include: [
          {
            model: interestModel,
            attributes: ["id", "name"],
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
        if (req.headers.authorization !== undefined) {
          const like = await likes.findAll({
            where: {
              typeId: questionObject[i].id,
              type:"question",
              userId: verifyToken(req.headers.authorization.split(" ")[1]).id,
              like: 1,
            },
          });
          localQuestion.isUserLiked = like.length > 0;
        }
        localQuestion = { ...localQuestion, ...meta };
        feedData.push(localQuestion);
      }

      return responseTemplate(200, true, "All searched questions", feedData);

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

module.exports = SearchController
