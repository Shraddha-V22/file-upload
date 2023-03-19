const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Order = createDB.define("orders", {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  productId: DataTypes.INTEGER,
  productName: DataTypes.STRING,
  productPrice: DataTypes.DECIMAL,
  buyerId: DataTypes.INTEGER,
  buyerEmail: DataTypes.STRING,
});

module.exports = Order;
