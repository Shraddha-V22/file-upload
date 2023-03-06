const express = require("express");
const User = require("../models/userModel");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const bcrypt = require("bcrypt");

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

module.exports = router;
