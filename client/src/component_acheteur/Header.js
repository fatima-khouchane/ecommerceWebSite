import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/logo.png";

function Header() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  const handlePublishAd = async () => {
    try {
      await axios.put(
        "http://localhost:3000/user/switchRole",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/panier/dashboard");
    } catch (error) {
      console.error("Erreur lors de la publication de l'annonce :", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/logout");
      console.log(response.data);
      localStorage.removeItem("token");
      setToken(null); // Réinitialiser l'état du token à null après la déconnexion
      navigate("/"); // Rediriger vers la page d'accueil ou une autre page appropriée après la déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <header>
      <div id="header">
        <div className="header-list">
          <nav className="header-list-nav">
            <ul>
              <li>
                <Link to="/">Produits</Link>
              </li>
              <li>
                <Link to="/PaidOrders">Mes commandes</Link>
              </li>
              {token && token.trim() !== "" ? (
                <>
                  <li className="header-list-icon">
                    <Link to="/panier">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </Link>
                  </li>
                  <li>
                    <button onClick={handlePublishAd}>
                      Publier une annonce
                    </button>
                  </li>
                </>
              ) : null}
              {token ? (
                <>
                  <li className="header-list-icon">
                    <Link to="/Favoris">
                      <i className="fa-regular fa-heart fa "></i>
                    </Link>
                  </li>
                  <li>
                    <Link onClick={handleLogout}>Déconnexion</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
