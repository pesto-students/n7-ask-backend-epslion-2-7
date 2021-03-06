"use strict";
const {
  userLogin,
  resetUserPassword,
  getUserDetails,
  creatUserDetails,
  updateUserDetails,
  getUserAnswers,
  getUserComments,
  getUserQuestions,
} = require("./controller/user.controller");
const { addUserInterests } = require("./controller/interest.controller");
const { addQuestions,getQuestions } = require("./controller/questions.controller");
const { search } = require("./controller/search.controller");
const {
  addAnswer,
  getAnswers: getAns,
} = require("./controller/answers.controller");
const {
  addComments,
  getComments,
} = require("./controller/comments.controller");
const { toggleLike } = require("./controller/like.controller");
const { increaseViewCount } = require("./controller/view.controller");
const { getFeed } = require("./controller/feed.controller");
const { reputationCalculation } = require("./controller/reputation.controller");
const {
  getExpertsList,
  getExpertsQuestions,
} = require("./controller/askAnExpert.controller");
const { authentication: auth } = require("./controller/auth.controller");

module.exports.userGet = async function (event) {
  return await getUserDetails(event);
};

module.exports.userUpdate = async function (event) {
  return await updateUserDetails(event);
};

module.exports.userCreate = async function (event) {
  return await creatUserDetails(event);
};
module.exports.userAnswers = async function (event) {
  return await getUserAnswers(event);
};
module.exports.userQuestions = async function (event) {
  return await getUserQuestions(event);
};
module.exports.userComments = async function (event) {
  return await getUserComments(event);
};

module.exports.resetPassword = async function (event) {
  return await resetUserPassword(event);
};

module.exports.login = async function (event) {
  return await userLogin(event);
};

module.exports.interests = async function (event) {
  return await addUserInterests(event);
};

module.exports.authentication = async function (event) {
  return auth(event);
};

module.exports.questionCreate = async function (event) {
  return await addQuestions(event);
};

module.exports.getQuestion = async function (event) {
  return await getQuestions(event);
};

module.exports.view = async function (event) {
  return await increaseViewCount(event);
};

module.exports.like = async function (event) {
  return await toggleLike(event);
};

module.exports.createComment = async function (event) {
  return await addComments(event);
};

module.exports.getComment = async function (event) {
  return await getComments(event);
};

module.exports.createAnswer = async function (event) {
  return await addAnswer(event);
};

module.exports.getAnswers = async function (event) {
  return await getAns(event);
};

module.exports.userFeed = async function (event) {
  return await getFeed(event);
};

module.exports.search = async function (event) {
  return await search(event);
};

module.exports.reputation = async function (event) {
  return await reputationCalculation(event);
};

module.exports.expertList = async function (event) {
  return await getExpertsList(event);
};

module.exports.expertQuestions = async function (event) {
  return await getExpertsQuestions(event);
};
