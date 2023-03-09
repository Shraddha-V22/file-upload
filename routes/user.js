const express = require("express");
const User = require("../models/userModel");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isSeller } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(403).send("User already exists");
    }

    if (!validateName) {
      return res.status(400).send({ error: "Please provide valid name" });
    }
    if (!validateEmail) {
      return res.status(400).send({ error: "Please provide valid email" });
    }
    if (!validatePassword) {
      return res.status(400).send({ error: "Please provide valid password" });
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));

    const user = {
      name,
      email,
      isSeller,
      password: hashedPassword,
    };

    const createdUser = await User.create(user);

    return res.status(201).json({
      message: `Welcome, ${createdUser.name}`,
    });
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0) {
      return res.status(400).json({
        err: "Please provide valid email.",
      });
    }
    if (password.length === 0) {
      return res.status(400).json({
        err: "Please provide valid password.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({
        err: "User not found",
      });
    }
    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordMatched) {
      return res.status(400).json({
        err: "Incorrect email or password",
      });
    }

    const payload = { user: { id: existingUser.id } };
    const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
      expiresIn: 360000,
    });
    res.cookie("t", bearerToken, { expire: new Date() * 9999 });

    return res.status(200).json({
      bearerToken,
    });
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;
