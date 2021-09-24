const { encryptPassword } = require("../util/hashPassword");
module.exports = (sql, Sequelize) => {
  return sql.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.NUMBER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: 3,
            msg: "Name must be at least 3 characters in length",
          },
          isAlpha: {
            msg: "Name should does not contain number or symbol ",
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [6, 128],
            msg: "Email address must be between 6 and 128 characters in length",
          },
          isEmail: {
            msg: "Email address must be valid",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: 3,
            msg: "Password should contain at least 8 char",
          },
          is: {
            args: /((?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*.]).{8,1024})/,
            msg: "Password should contain at least special char and should be 8 char long",
          },
        },
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      coverPic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reputation: {
        type: Sequelize.NUMBER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      hooks: {
        beforeSave: function (user) {
          user.password = encryptPassword(user.password);
        },
      },
    },
    {
      freezeTableName: true,
    }
  );
};
