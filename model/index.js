const dbConfig = require("../service/database");
const Sequelize = require("sequelize");
const db = {};
db.Sequelize = Sequelize;
db.sequelize = dbConfig;
db.userModel = require("./users.model")(dbConfig, Sequelize);
db.interestModel = require("./interests.model")(dbConfig, Sequelize);
db.userInterestModel = require("./users_interest.model")(dbConfig, Sequelize);
db.questions = require("./questions.model")(dbConfig, Sequelize);
db.answers = require("./answers.model")(dbConfig, Sequelize);
db.likes = require("./likes.model")(dbConfig, Sequelize);
db.comments = require("./comments.model")(dbConfig, Sequelize);
db.questionsInterest = require("./questionsInterest.model")(dbConfig, Sequelize);
db.views = require("./views.model")(dbConfig, Sequelize);

db.questions.belongsTo(db.userModel, {foreignKey: 'userId', targetKey: 'id'})
db.answers.belongsTo(db.userModel, {foreignKey: 'userId', targetKey: 'id'})
db.comments.belongsTo(db.userModel, {foreignKey: 'userId', targetKey: 'id'})
db.userInterestModel.belongsTo(db.userModel, {foreignKey: 'userId', targetKey: 'id'})
db.userInterestModel.belongsTo(db.interestModel, {foreignKey: 'interestId', targetKey: 'id'})

db.questions.belongsToMany(db.interestModel, {
    through: "questions_interests",
    foreignKey: "questionId",
});

db.interestModel.belongsToMany(db.questions, {
    through: "questions_interests",
    foreignKey: "interestId",
});

db.userModel.belongsToMany(db.interestModel, {
    through: "users_interests",
    foreignKey: "userId",
});

db.interestModel.belongsToMany(db.userModel, {
    through: "users_interests",
    foreignKey: "interestId",
});


module.exports = db;
