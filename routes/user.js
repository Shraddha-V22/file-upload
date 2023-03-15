const express = require("express");
const User = require("../models/userModel"); //required in User model
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators"); // required in validator functions
const bcrypt = require("bcrypt"); //required in bcrypt
const jwt = require("jsonwebtoken"); //required in jwt

const router = express.Router();

router.post("/signup", async (req, res) => {
  //signup api
  try {
    const { name, email, password, isSeller } = req.body; //destructuring credentials from req.body

    const existingUser = await User.findOne({ where: { email } }); //looking for existing Users

    if (existingUser) {
      return res.status(403).send("User already exists"); //If exists, send error
    }

    if (!validateName) {
      return res.status(400).send({ error: "Please provide valid name" }); //validate name, send error
    }
    if (!validateEmail) {
      return res.status(400).send({ error: "Please provide valid email" }); //validate email, send error
    }
    if (!validatePassword) {
      return res.status(400).send({ error: "Please provide valid password" }); //validate password, send error
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10)); //encrypting the password

    const user = {
      name,
      email,
      isSeller,
      password: hashedPassword,
    }; //creating user object

    const createdUser = await User.create(user); //creating user in the database

    return res.status(201).json({
      message: `Welcome, ${createdUser.name}`, //sending ok msg
    });
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`); //sending error if any
  }
});

router.post("/signin", async (req, res) => {
  //sign in api
  try {
    const { email, password } = req.body; //taking email and password from the req.body
    if (email.length === 0) {
      //if email length is 0 send error
      return res.status(400).json({
        err: "Please provide valid email.",
      });
    }
    if (password.length === 0) {
      //if password length is 0 send error
      return res.status(400).json({
        err: "Please provide valid password.",
      });
    }

    const existingUser = await User.findOne({ where: { email } }); //looking for the user logging in in the database

    if (!existingUser) {
      //if no user found, send error
      return res.status(404).json({
        err: "User not found",
      });
    }
    const passwordMatched = await bcrypt.compare(
      //if found, compare the password with the encrypted password
      password,
      existingUser.password
    );
    if (!passwordMatched) {
      //if password doesn't match, send error
      return res.status(400).json({
        err: "Incorrect email or password",
      });
    }

    const payload = { user: { id: existingUser.id } }; //created payload with the user id
    const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
      //creating the bearer token, everytime user logs in
      expiresIn: 360000,
    });
    res.cookie("t", bearerToken, { expire: new Date() * 9999 }); //saving it in the cookie with name t

    return res.status(200).json({
      //if everything ok, return the bearer token
      bearerToken,
    });
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`); //send error, if any
  }
});

router.get("/signout", async (req, res) => {
  //signout api
  try {
    res.clearCookie("t"); //clear the cookie data with name 't'
    return res.status(200).json({ message: "Cookie deleted" }); //send msg cookie deleted
  } catch (error) {
    return res.status(500).send(error.message); //send error if any
  }
});

module.exports = router; //export router
