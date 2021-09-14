module.exports = (sql, Sequelize) => {
    return sql.define("views", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.NUMBER,
        },
        type: {
            type: Sequelize.ENUM,
            values: ["question", "answer", "comment"],
            validate: {
                isIn: {
                    args: [["question", "answer", "comment"]],
                    msg: "Type must be question, answer or comment "
                }
            }
        },
        typeId: {
            type: Sequelize.NUMBER,
        },
        views: {
            type: Sequelize.NUMBER,
        },
    });
};
