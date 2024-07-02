const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {User} = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
// register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Par défaut, le rôle est 0 (acheteur) si non spécifié
    const role = req.body.role || 0;

    // Vérifiez que tous les champs requis sont présents
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // Hash le mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Créez un nouvel utilisateur avec le rôle spécifié
    const user = await new User({
      name,
      email,
      password: password_hash,
      role,
    }).save();

    res.json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});


// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "user non trouvé !" });
    }

    const valide_password = await bcrypt.compare(password, user.password);

    if (!valide_password) {
      return res.json({ error: "Mot de passe incorrect " });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.name },
      "secretkey",
      {
        expiresIn: "24h",
      }
    );
    console.log(token);

    res
      .status(200)
      .json({ login: "success", userId: user._id, username: user.name, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// logOut
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
});

// info user connecter
router.get("/profile", authMiddleware, (req, res) => {
  try {
    res.json(req.user);
    // console.log(req.user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// modifier profile pour switche le role
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.user._id; 

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) existingUser.name = name;
    if (email) existingUser.email = email;
    if (role !== undefined && (role === 0 || role === 1)) {
      existingUser.role = role;
    }

    await existingUser.save();

    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// switch role
router.put("/user/switchRole", authMiddleware, async (req, res) => {
  try {
    // Récupérer l'utilisateur à partir du token
    const userId = req.user._id;
    // Récupérer l'utilisateur de la base de données
    const user = await User.findById(userId);

    // Basculer le rôle de l'utilisateur
    user.role = user.role === 0 ? 1 : 0; // Si le rôle est 0 (acheteur), changer en 1 (vendeur), sinon changer en 0 (acheteur)
    await user.save();

    res
      .status(200)
      .json({ message: "Rôle de l'utilisateur mis à jour avec succès" ,role:user.role});
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du rôle de l'utilisateur :",
      error
    );
    res
      .status(500)
      .json({
        error: "Erreur lors de la mise à jour du rôle de l'utilisateur",
      });
  }
});




router.put("/user/switchRole0", authMiddleware, async (req, res) => {
  try {
    // Récupérer l'utilisateur à partir du token
    const userId = req.user._id;
    // Récupérer l'utilisateur de la base de données
    const user = await User.findById(userId);

    // Basculer le rôle de l'utilisateur
    user.role = user.role === 1 ? 0 : 1; // Si le rôle est 0 (acheteur), changer en 1 (vendeur), sinon changer en 0 (acheteur)
    await user.save();

    res
      .status(200)
      .json({
        message: "Rôle de l'utilisateur mis à jour avec succès",
        role: user.role,
      });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du rôle de l'utilisateur :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la mise à jour du rôle de l'utilisateur",
    });
  }
});


module.exports = router;
