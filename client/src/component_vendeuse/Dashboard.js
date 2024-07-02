import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../component_acheteur/useAuth";
import OFPPT_Logo from "../images/logo.png";
import "./vendeuse.css"; 
import SideMenu from "./SideMenu"; 
const AddAnonce = () => {
  const [token, setToken] = useState(null);
  const { username } = useAuth();
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "", 
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("tokeeeeeeeeeeeen", token);
    setToken(token);
  }, []);



  const [formData, setFormData] = useState({
    nomProduit: "",
    description: "",
    prix: "",
    category: "",
    imageUrl: "",
    quantity: "",
    adress:""
  });
console.log('objet envoyeeeeeeeeeeeeeeeeeeeeer',formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/addAnnonce", formData, config); 
      console.log("Data uploaded successfully");
      window.alert("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      window.alert("Error uploading data. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setFormData({ ...formData, imageUrl: base64 });
  };

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

 
  return (
    <>
      <SideMenu />

      <main>
        <div className="page-header">
          <h4>Espace</h4>
          <small>Vendeuse</small>
          <h1>Bienvenue {username}</h1>
        </div>

        <div className="page-content">
          <div className="analytics">
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-left">
                <label>
                  Catégorie
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option>choisir categorie</option>
                    <option value="vetement">Vêtement</option>
                    <option value="informatique">Informatique</option>
                  </select>
                </label>
                <label>
                  Nom
                  <input
                    type="text"
                    name="nomProduit"
                    value={formData.nomProduit}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Prix
                  <input
                    type="number"
                    name="prix"
                    value={formData.prix}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="form-right">
                <label>
                  Description
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Quantité
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Adresse
                  <input
                    type="text"
                    name="adress"
                    value={formData.adress}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Image
                  <input
                    type="file"
                    name="myFile"
                    accept=".jpeg, .png, .jpg"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <button type="submit" className="form-submit">
                Submit
              </button>
            </form>
          </div>

          <div className="records table-responsive">
            <div className="record-header"></div>
            <div></div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddAnonce;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
