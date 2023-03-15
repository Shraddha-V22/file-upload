const { DataTypes } = require("sequelize"); //require in datatypes from sequelize
const { createDB } = require("../config/db"); //require in the database we had created

const User = createDB.define("user", {
  //creating the user model
  id: {
    primaryKey: true,
    allowNull: false, //null value not allowed
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
