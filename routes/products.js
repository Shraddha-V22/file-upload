const express = require("express");
const { isAuthenticated, isSeller, isBuyer } = require("../middlewares/auth");
const upload = require("../utils/fileUpload"); //require in upload fn.
const router = express.Router(); //create router
const Product = require("../models/productModel");
// const { SECRET_API_KEY } = require("../config/credentials");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_API_KEY);
const { WebhookClient } = require("discord.js");
const Order = require("../models/orderModel");

const webhook = new WebhookClient({
  url: "https://discord.com/api/webhooks/1086261254726897665/fHrw_pnYb8LZfN0aYgnzODysd-DrQfrGzgSZeRKEy26l-1jBG6Iqfaukg1XpeddE7aeX",
});

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

    const createdProduct = await Product.create(productDetails); //create product in the product database

    console.log(createdProduct);

    //return product created msg
    return res.status(201).json({
      message: "Product created",
    });
  });
});

router.get("/get/all", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ products: products });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
});

router.post("/buy/:productId", isAuthenticated, isBuyer, async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(404).json({ err: "No product found" });
    }

    console.log(product, req.user);

    const orderDetails = {
      productId: product.dataValues.id,
      productName: product.dataValues.name,
      productPrice: product.dataValues.price,
      buyerId: req.user.dataValues.id,
      buyerEmail: req.user.dataValues.email,
    };

    console.log(">>>>>>>", orderDetails, Order);

    let paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 9,
        exp_year: 2023,
        cvc: "514",
      },
    });

    let paymentIntent = await stripe.paymentIntents.create({
      amount: product.dataValues.price * 100,
      currency: "inr",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
    });

    // console.log(Order, paymentIntent, paymentMethod);

    if (paymentIntent) {
      console.log(">>>>", paymentIntent);
      const createdOrder = await Order.create(orderDetails);

      console.log(">>>>>", createdOrder);

      webhook.send({
        content: `I am sending it from order id: ${createdOrder}`,
        username: "captain-hook",
        avatarURL:
          "https://infoliteraria.com/wp-content/uploads/2021/04/Nick-y-Charlie-heartstoppers-1024x1024.jpg",
      });

      return res.status(201).json({ message: "Order created", createdOrder });
    } else {
      return res.status(400).json({ err: "Something went wrong" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ err: error.message });
  }
});

module.exports = router;
