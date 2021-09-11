module.exports = (sql, Sequelize) => {
  return sql.define("answers", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.NUMBER,
    },
    userId: {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    questionId: {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: "questions",
        key: "id",
      },
    },
    answer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
