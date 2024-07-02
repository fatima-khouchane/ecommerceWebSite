const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Product } = require("../models/Product");

// get all annonce
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la récupération des produits.",
    });
  }
});

router.delete("/annonceDelete/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    // Vérifier si l'utilisateur est autorisé à supprimer cette annonce
    // Vous pouvez ajouter votre logique d'autorisation ici

    // Supprimer l'annonce de la base de données
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'annonce" });
  }
});
// add annonce
router.post("/addAnnonce", authMiddleware, async (req, res) => {
  try {
    const { nomProduit, description, prix, category, imageUrl, quantity, adress } =
      req.body;
    const user = req.user;

    // Vérifiez que l'utilisateur a le rôle de vendeur (role=1)
    if (user.role !== 1) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé : vous devez être un vendeur pour ajouter une annonce.",
        });
    }

    const newProduct = await Product.create({
      nomProduit,
      description,
      prix,
      quantity,
      category,
      adress,
      imageUrl,
      id_vendeuse: user._id, // id de vendeuse dans laquelle est creer annonce
    });

    res.status(201).json("Produit ajouté avec succès");
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
  }
});

// add to favorite
router.post("/addToFavorites/:productId", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    // Vérifiez que l'utilisateur a le rôle d'acheteur (role=0)
    if (user.role !== 0) {
      return res.status(403).json({
        error:
          "Accès refusé : seuls les acheteurs peuvent ajouter des produits aux favoris.",
      });
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (product) {
      product.isFavorite = true;
      await product.save();
      res.status(201).json("Product added to favorites!");
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error adding product to favorites:", error);
    res.status(500).json({ error: "Error adding product to favorites" });
  }
});


// get favories
  router.get("/favoris", authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      // Vérifiez que l'utilisateur a le rôle d'acheteur (role=0)
      if (user.role !== 0) {
        return res.status(403).json({
          error:
            "Accès refusé : seuls les acheteurs peuvent accéder aux favoris.",
        });
      }

      const favoris = await Product.find({ isFavorite: true });
      res.json(favoris);
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des favoris" });
    }
  });

// delete favorite
router.delete(
  "/api/removeFromFavorites/:productId",
  authMiddleware,
  async (req, res) => {
    const { productId } = req.params;
    const user = req.user;

    try {
      // Vérifiez que l'utilisateur a le rôle d'acheteur (role=0)
      if (user.role !== 0) {
        return res.status(403).json({
          error:
            "Accès refusé : seuls les acheteurs peuvent supprimer des produits des favoris.",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { isFavorite: false },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({
        message: "Product removed from favorites",
        updatedProduct,
      });
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      res.status(500).json({
        error: "Error removing product from favorites. Please try again.",
      });
    }
  }
);


router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ idcategory: category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get product by son id
router.get("/product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




router.get('/productsVendeuse', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 1) {
      return res.status(403).json({
        error: 'Accès refusé : vous devez être un vendeur pour voir les produits.',
      });
    }

    const products = await Product.find({ id_vendeuse: userId });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Une erreur s\'est produite lors de la récupération des produits du vendeur.',
    });
  }})
module.exports = router;
