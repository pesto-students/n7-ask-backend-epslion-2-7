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
      user_id: {
        type: Sequelize.NUMBER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      interest_id: {
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
