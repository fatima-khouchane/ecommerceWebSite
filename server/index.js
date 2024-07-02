const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const panierRoutes = require("./routes/panierRoutes");

const app = express();
const PORT = 3000;

// Ajoutez cette ligne pour augmenter la limite de taille du payload
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce_mern")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(userRoutes);
app.use(productRoutes);
app.use(panierRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
