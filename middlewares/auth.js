const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  //middlerware to check if the user is authenticated
  try {
    const authHeader = req.headers.authorization; //taking the authorization property from the headers

    if (!authHeader) {
      //if no header found
      return res.status(401).json({
        //send error msg
        err: "authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1]; //if found, take the bearer token out by using split method

    if (!token) {
      //if no token found, send error msg
      return res.status(401).json({
        err: "token not found",
      });
    }

    const decoded = jwt.verify(token, "SECRET MESSAGE"); //verify the token by using the secret message, and decode it using jwt

    const user = await User.findOne({ where: { id: decoded.user.id } }); //find the user in the db by the user.id

    if (!user) {
      //if no user found, send error msg
      return res.status(404).json({
        err: "User not found",
      });
    }
    req.user = user; //user found, extend the req object by adding user object to it.

    next(); //passing the data to the next function in line
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`); //send error msg if any
  }
};

const isSeller = async (req, res, next) => {
  //middlerware to check whether the user is a seller
  try {
    if (req.user.dataValues.isSeller) {
      //if seller is true
      next(); // pass on to the next function in line
    } else {
      return res.status(401).json({
        //if not send msg
        err: "User is not a seller",
      });
    }
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`); //send error msg if any
  }
};

const isBuyer = async (req, res, next) => {
  try {
    if (!req.user.dataValues.isSeller) {
      next();
    } else {
      res.status(401).json({
        err: "User is not a buyer",
      });
    }
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`);
  }
};

module.exports = { isAuthenticated, isSeller, isBuyer }; //export the functions
