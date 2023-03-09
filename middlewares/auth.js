const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        err: "authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        err: "token not found",
      });
    }

    const decoded = jwt.verify(token, "SECRET MESSAGE");

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({
        err: "User not found",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`);
  }
};

const isSeller = async (req, res, next) => {
  try {
    if (req.User.dataValues.isSeller) {
      next();
    } else {
      return res.status(401).json({
        err: "User is not a seller",
      });
    }
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`);
  }
};

module.exports = { isAuthenticated, isSeller };
