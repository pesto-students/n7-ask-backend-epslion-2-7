module.exports = (sql, Sequelize) => {
  return sql.define("questions", {
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
    expertId: {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    question: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
