"use strict";
const {
  userLogin,
  resetUserPassword,
  getUserDetails,
  creatUserDetails,
  updateUserDetails,
} = require("./controller/user.controller");
const { addUserInterests } = require("./controller/interest.controller");
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
  return await auth(event);
};
