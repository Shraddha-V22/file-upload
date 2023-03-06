const express = require("express");
const app = express();
const { connectDB } = require("./config/db");

//middlewares
app.use(express.json());
app.use(express.static("content"));
app.use(express.urlencoded({ extended: false }));

const PORT = 1337;
app.use(PORT, () => {
  console.log("Server is running");
  connectDB();
});
