const { answers, comments, likes, views } = require("../model/index");

const MetaData = async (data,answerNeed = true) => {
  let localAnswers = answerNeed && await answers.count({
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

  let returnData = {
    answers: localAnswers,
    comments: localComments,
    likes: localLikes,
    views: localViews,
  }
  if(!answerNeed) delete returnData['answers']
  return returnData
};

module.exports=MetaData
