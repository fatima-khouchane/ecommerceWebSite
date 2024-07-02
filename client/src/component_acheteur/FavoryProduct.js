import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { useAuth } from "./useAuth";
import "./favoriCart.css";

const Favoris = () => {
  const [favoris, setFavoris] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const response = await axios.get("http://localhost:3000/favoris", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoris(response.data);
      } catch (error) {
        console.error("Error fetching favoris:", error);
      }
    };

    if (token) {
      fetchFavoris();
    }
  }, [token]);

  return (
    <>
      <Header />
      <div class="favoris-container">
        <div class="header">
          <h2>Produits Favoris</h2>
        </div>

        <div class="favoris-list">
          {favoris.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "40px" }}>
              Aucun produit favori trouvé.
            </p>
          ) : (
            favoris.map((produit) => (
              <div class="favoris-card" key={produit._id}>
                <div class="favoris-image">
                  <img
                    class="image"
                    src={produit.imageUrl}
                    alt={produit.name}
                  />
                </div>
                <div class="favoris-content">
                  <h3 class="name">{produit.name}</h3>
                  <p class="description">{produit.description}</p>
                  <p class="price">Prix : {produit.price} DH</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Favoris;
