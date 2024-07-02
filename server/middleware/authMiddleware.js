const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Veuillez vous connecter pour accéder aux données" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Veuillez vous connecter pour accéder aux données" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );
    req.user = await User.findById(decodedToken.userId);

    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = authMiddleware;
