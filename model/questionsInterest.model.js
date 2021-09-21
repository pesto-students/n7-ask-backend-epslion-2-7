"use strict";
module.exports = (sql, Sequelize) => {
    return sql.define(
        "questions_interests",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.NUMBER,
            },
            questionId: {
                type: Sequelize.NUMBER,
                allowNull: false,
                references: {
                    model: "questions",
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
