const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync();
const encryptPassword = function (password) {
  return bcrypt.hashSync(password, salt, null);
};

const decryptPassword = function (password, storedPassword) {
  return bcrypt.compareSync(password, storedPassword);
};

const hash = {
  encryptPassword,
  decryptPassword,
};
module.exports = hash;
