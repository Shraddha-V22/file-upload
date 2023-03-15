const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

//define the product model
const Product = createDB.define("product", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  content: DataTypes.STRING,
});

module.exports = Product;
