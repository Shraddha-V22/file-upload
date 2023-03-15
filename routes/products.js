const express = require("express");
const { isAuthenticated, isSeller } = require("../middlewares/auth");
const upload = require("../utils/fileUpload"); //require in upload fn.
const router = express.Router(); //create router

router.post("/create", isAuthenticated, isSeller, async (req, res) => {
  //create api for the seller to upload products //first check if the user is auhtenticated and if he is the seller using middlewares
  upload(req, res, async (err) => {
    //upload function
    if (err) {
      //error if any
      return res.status(500).send({ err });
    }

    const { name, price } = req.body; //take name and price form the body
    if (!name || !price || !req.file) {
      //check if any field is missing
      return res.status(400).json({
        err: "All fields should be selected - name, price, file", //error msg
      });
    }

    if (Number.isNaN(price)) {
      //see if price is NaN
      return res.status(400).json({
        err: "Price must be a number",
      });
    }

    let productDetails = {
      //return product details object with the content received from the body
      name,
      price,
      content: req.file.path,
    };

    return res.status(200).json({
      //return okay status and product details
      status: "ok",
      productDetails,
    });
  });
});

module.exports = router;
