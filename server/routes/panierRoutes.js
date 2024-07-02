const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Cart } = require("../models/Cart.js");
const { Product } = require("../models/Product");

// ajouter au panier
router.post("/addPanier", authMiddleware, async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user._id;

    if (req.user.role !== 0) {
      return res.status(403).json({
        error: "Access denied: only buyers can add products to the cart.",
      });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    // Vérifier si l'utilisateur a déjà une commande non payée
    let cart = await Cart.findOne({ id_acheteur: userId, status: "unpaid" });

    let total = 0;

    if (!cart) {
      // Si la commande est déjà payée, créer une nouvelle commande pour les nouveaux produits
      cart = new Cart({ id_acheteur: userId, products });
    } else {
      // Utiliser le total actuel du panier comme point de départ pour le calcul du total mis à jour
      total = cart.total || 0;

      // Ajouter les nouveaux produits à la commande existante
      for (const productData of products) {
        const existingProductIndex = cart.products.findIndex(
          (p) =>
            p.productId.toString() === productData.productId &&
            p.id_vendeuse.toString() === productData.id_vendeuse
        );
        if (existingProductIndex !== -1) {
          // Si le produit existe déjà dans le panier, mettre à jour la quantité
          cart.products[existingProductIndex].quantity += productData.quantity;
        } else {
          // Sinon, ajouter le nouveau produit au panier
          cart.products.push(productData);
        }

        // Récupérer le produit depuis la base de données pour calculer le total mis à jour
        const product = await Product.findById(productData.productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        // Mettre à jour le total à chaque itération
        total += product.prix * productData.quantity;
      }
    }

    // Mettre à jour le champ total du panier
    cart.total = total;

    await cart.save();

    res.status(201).json({ message: "Products added to cart successfully" });
  } catch (error) {
    console.error("Error adding product(s) to cart:", error);
    res.status(500).json({ error: "Error adding product(s) to cart" });
  }
});


// confirmer panier
router.put("/api/confirmOrder", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    // Find the user's order
    let order = await Cart.findOne({ _id: orderId, id_acheteur: userId });

    // Check if the order exists and is unpaid
    if (!order || order.status !== "unpaid") {
      return res.status(404).json({ error: "Order not found or already paid" });
    }

    // Update the order status to 'paid'
    order.status = "paid";
    await order.save();

    res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Error confirming order" });
  }
});

// modifier status de comende apres confirmer
router.put("/confirmOrder", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    // Trouver la commande de l'utilisateur
    let order = await Cart.findOne({ _id: orderId, id_acheteur: userId });

    // Vérifier si la commande existe et si elle est dans l'état "unpaid"
    if (!order || order.status !== "unpaid") {
      return res.status(404).json({ error: "Order not found or already paid" });
    }

    // Mettre à jour le statut de la commande en "paid"
    order.status = "paid";
    await order.save();

    res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ error: "Error confirming order" });
  }
});

// recupere tous les commende de user connecter en tan que acheteur
router.get("/myOrders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 0) {
      return res.status(403).json({
        error: "Access denied: only buyers can view their orders.",
      });
    }

    const orders = await Cart.find({ id_acheteur: userId }).populate(
      "products.productId"
    );

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Error fetching user orders" });
  }
});

router.get("/unpaidOrders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unpaid orders for the user
    const unpaidOrders = await Cart.find({
      id_acheteur: userId,
      status: "unpaid",
    }).populate("products.productId");

    res.status(200).json(unpaidOrders);
  } catch (error) {
    console.error("Error fetching unpaid orders:", error);
    res.status(500).json({ error: "Error fetching unpaid orders" });
  }
});


router.get("/paidOrders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all paid orders for the user
    const paidOrders = await Cart.find({
      id_acheteur: userId,
      status: "paid",
    }).populate("products.productId");

    res.status(200).json(paidOrders);
  } catch (error) {
    console.error("Error fetching paid orders:", error);
    res.status(500).json({ error: "Error fetching paid orders" });
  }
});


router.delete("/cart/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    // Recherchez le panier de l'utilisateur
    let cart = await Cart.findOne({ id_acheteur: userId, status: "unpaid" });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Trouvez l'index du produit dans le panier
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Supprimez le produit du panier
    cart.products.splice(productIndex, 1);

    // Enregistrez les modifications dans la base de données
    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// anonce de vendeuse connecter qui est creer
router.get("/vendeurOrders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 1) {
      return res.status(403).json({
        error:
          "Accès refusé : vous devez être un vendeur pour voir les commandes.",
      });
    }

    const paidCarts = await Cart.find({
      "products.id_vendeuse": userId, 
      status: "paid", 
    }).populate("products.productId"); 

    res.json(paidCarts);
  } catch (error) {
    console.error("Error fetching paid carts:", error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des paniers payés du vendeur.",
    });
  }
});
// commmede de deja effectuer de user connecter 




module.exports = router;
