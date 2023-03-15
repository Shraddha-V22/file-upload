const express = require("express"); //required in express
const app = express(); //called the function
const { connectDB } = require("./config/db"); //required in the database
const userRoutes = require("./routes/user"); //required in the userRoutes
const productRoutes = require("./routes/products"); //required in the productRoutes

//middlewares
app.use(express.json()); // to accept json
app.use(express.static("content")); //to make the content folder public
app.use(express.urlencoded({ extended: false })); //Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option

app.use("/api/v1/user", userRoutes); //if api/v1/user is called then it will go to userRoutes
app.use("/api/v1/products", productRoutes); //similar as above

app.get("/", async (req, res) => {
  return res.status(200).send("api works");
});

const PORT = 1337; //declared the port
app.listen(PORT, () => {
  //listen to the server at the port
  console.log("Server is running");
  connectDB();
});
