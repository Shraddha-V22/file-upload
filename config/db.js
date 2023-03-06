const { Sequelize } = require("sequelize");

const createDB = new Sequelize("test-db", "username", "password", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

const connectDB = () => {
  createDB
    .sync()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((e) => {
      console.log("connection to DB failed", e.message);
    });
};

module.exports = { connectDB, createDB };
