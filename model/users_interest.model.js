"use strict";
module.exports = (sql, Sequelize) => {
  return sql.define(
    "users_interests",
    {
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
      interestId: {
        type: Sequelize.NUMBER,
        allowNull: false,
        references: {
          model: "interests",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
