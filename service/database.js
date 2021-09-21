const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.RDS_DB,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialectOptions: {
      multipleStatements: true,
    },
  },
);
module.exports = sequelize;
