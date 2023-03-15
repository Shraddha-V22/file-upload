const { Sequelize } = require("sequelize"); //require in sequelize

const createDB = new Sequelize("test-db", "username", "password", {
  //create db
  dialect: "sqlite", //what dialect
  host: "./config/db.sqlite", //where to host
});

const connectDB = () => {
  createDB
    .sync() //sync the db
    .then(() => {
      console.log("connected to DB"); //and log value after syncing
    })
    .catch((e) => {
      console.log("connection to DB failed", e.message); //error if any
    });
};

module.exports = { connectDB, createDB }; //export db and sync function
