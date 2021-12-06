module.exports = (sql, Sequelize) => {
  return sql.define("likes", {
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
    type: {
      type: Sequelize.ENUM,
      values: ["question", "answer", "comment"],
      validate: {
        isIn: {
          args: [["question", "answer", "comment"]],
          msg: " Type must be question, answer or comment ",
        },
      },
    },
    typeId: {
      type: Sequelize.NUMBER,
    },
    like: {
      type: Sequelize.NUMBER,
    },
  });
};
