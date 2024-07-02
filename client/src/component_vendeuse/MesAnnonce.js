import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../component_acheteur/useAuth";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";

function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchAnnonces();
    }
  }, [token]); 

  // fetch annonce de vendeuse connecter
  const fetchAnnonces = async () => {
    if (!token) {
      console.error("Token not available");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/productsVendeuse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnnonces(response.data);
    } catch (error) {
      console.error("Error fetching annonces:", error);
    }
  };

  // delete annonce
  const handleDeleteAnnonce = async (id) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette annonce ?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/annonceDelete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAnnonces();
      alert("Annonce supprimée avec succès !");
    } catch (error) {
      console.error("Error deleting annonce:", error);
    }
  };

    return (
      <div className="annonces-container">
        <SideMenu />
        <h2>Mes Annonces</h2>
        {annonces.length === 0 ? (
          <>
            <p style={{ textAlign: "center", marginTop: "100px" }}>
              Aucune annonce disponible pour le moment.
            </p>
            <Link to="/panier/dashboard" className="link-button">
              Publier une annonce
            </Link>
          </>
        ) : (
          <ul className="annonces-list">
            {annonces.map((annonce) => (
              <li key={annonce._id} className="annonce-card">
                <div className="annonce-content">
                  <h3>{annonce.nomProduit}</h3>
                  <p>Description: {annonce.description}</p>
                  <p>Prix: {annonce.prix}</p>
                  <p>Quantité: {annonce.quantity}</p>
                  <p>Catégorie: {annonce.category}</p>
                  <p>Adresse: {annonce.adress}</p>
                  <button
                    onClick={() => handleDeleteAnnonce(annonce._id)}
                    className="delete-button"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default Annonces;
