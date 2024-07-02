import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import axios from "axios";
import Header from "./Header";

function Index() {
  const { token, username } = useAuth();
  console.log("token produit", token);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [quantity, setQuantity] = useState([]);
  const [cartLength, setCartLength] = useState(0); // État pour la longueur du panier

  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
        setQuantity(response.data.map(() => 1)); // Initialize quantities for each product
        setLoading(false);
      } catch (error) {
        setError("Une erreur s'est produite, veuillez réessayer.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToFavorites = async (productId) => {
    try {
      await axios.post(
        `http://localhost:3000/addToFavorites/${productId}`,
        null,
        config
      );
      alert("Produit ajouté aux favoris !");
      console.log(productId);

      const updatedFavorites = new Set([...favoriteProducts, productId]);
      setFavoriteProducts(updatedFavorites);
      localStorage.setItem(
        "favoriteProducts",
        JSON.stringify(Array.from(updatedFavorites))
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris :", error);
      alert("Erreur lors de l'ajout aux favoris. Veuillez réessayer.");
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/removeFromFavorites/${productId}`,
        config
      );
      alert("Produit retiré des favoris !");

      const updatedFavorites = new Set(favoriteProducts);
      updatedFavorites.delete(productId);
      setFavoriteProducts(updatedFavorites);
      localStorage.setItem(
        "favoriteProducts",
        JSON.stringify(Array.from(updatedFavorites))
      );
    } catch (error) {
      console.error(
        "Erreur lors de la suppression des favoris :",
        error.response ? error.response.data : error
      );
      alert("Erreur lors de la suppression des favoris. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteProducts");
    if (savedFavorites) {
      setFavoriteProducts(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const filterProductsByCategory = () => {
    if (selectedCategory === "all") {
      return products;
    } else {
      return products.filter(
        (product) => product.category === selectedCategory
      );
    }
  };

  const handleQuantityChange = (index, e) => {
    const newQuantities = [...quantity];
    newQuantities[index] = parseInt(e.target.value);
    setQuantity(newQuantities);
  };

  const addToCart = async (productId, id_vendeuse, productIndex) => {
    try {
      const productResponse = await axios.get(
        `http://localhost:3000/product/${productId}`
      );
      const product = productResponse.data;
      console.log("Détails du produit :", product);

      if (product.quantity < quantity[productIndex]) {
        alert(
          "La quantité disponible en stock est insuffisante pour ajouter ce produit au panier."
        );
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/addPanier",
        {
          products: [
            { productId, quantity: quantity[productIndex], id_vendeuse },
          ],
        },
        config
      );

      alert("Produit ajouté au panier !");
      setCartLength(cartLength + 1); // Incrémenter la longueur du panier
      console.log("Nouvelle longueur du panier :", cartLength + 1); // Afficher la nouvelle longueur du panier

      console.log(response.data); // Afficher la réponse du serveur après l'ajout au panier
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit au panier :", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert(
          "Une erreur s'est produite lors de l'ajout au panier. Veuillez réessayer."
        );
      }
    }
  };

  const loadMoreProducts = () => {
    setVisibleProducts(products.length);
  };

  const showLessProducts = () => {
    setVisibleProducts(4);
  };

  return (
    <>
      {/* <Header /> Inclure l'en-tête ici */}
      <main>
        <section className="product-section section-p1">
          <div className="navbar-container">
            <div className="navbar">
              <p>Category</p>
              <ul>
                <li>
                  <button onClick={() => setSelectedCategory("all")}>
                    Tous les produits
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory("informatique")}>
                    Informatique
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory("vetement")}>
                    Vêtements
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory("laptop")}>
                    Laptop
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="product-grid">
            {loading ? (
              <p>Chargement en cours...</p>
            ) : error ? (
              <p>Erreur: {error}</p>
            ) : (
              filterProductsByCategory()
                .slice(0, visibleProducts)
                .map((product, index) => (
                  <div className="card" key={product._id}>
                    <div className="card-image">
                      <img src={product.imageUrl} alt="product image" />
                    </div>
                    <div className="card-content">
                      <h2 className="card-title">{product.nomProduit}</h2>
                      <p className="card-description">{product.description}</p>
                      <p className="card-price">{product.prix} dh</p>
                      {!token ? (
                        <div className="card-login-prompt">
                          <span style={{ color: "black" }}>
                            Vous devez vous connecter pour acheter
                            <Link to="/login" className="card-login-link">
                              login
                            </Link>
                          </span>
                        </div>
                      ) : (
                        <div className="card-actions">
                          <input
                            type="number"
                            value={quantity[index] || 0}
                            onChange={(e) => handleQuantityChange(index, e)}
                          />
                          <button
                            onClick={() =>
                              addToCart(product._id, product.id_vendeuse, index)
                            }
                            className="cart-icon"
                          >
                            <i className="fa-solid fa-cart-shopping"></i>
                          </button>
                          <div
                            className="favorite-icon"
                            onClick={() =>
                              favoriteProducts.has(product._id)
                                ? removeFromFavorites(product._id)
                                : addToFavorites(product._id)
                            }
                          >
                            <i
                              className={`fa-heart faheart ${
                                favoriteProducts.has(product._id)
                                  ? "fa-solid favorite"
                                  : "fa-regular"
                              }`}
                            ></i>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
          {visibleProducts < products.length ? (
            <button className="button-afficher-plus" onClick={loadMoreProducts}>
              Afficher plus
            </button>
          ) : (
            <button className="button-afficher-plus" onClick={showLessProducts}>
              Afficher moins
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export default Index;
