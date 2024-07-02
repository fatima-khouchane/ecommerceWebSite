import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../component_acheteur/useAuth";
import SideMenu from "./SideMenu";
import "./vendeuse.css";

function Cart() {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  const [acceptedOrders, setAcceptedOrders] = useState(() => {
    // Récupérer les IDs des commandes acceptées depuis localStorage lors du chargement initial
    const storedAcceptedOrders = localStorage.getItem("acceptedOrders");
    return storedAcceptedOrders ? JSON.parse(storedAcceptedOrders) : [];
  });

  useEffect(() => {
    // Mettre à jour localStorage lorsque acceptedOrders change
    localStorage.setItem("acceptedOrders", JSON.stringify(acceptedOrders));
  }, [acceptedOrders]);
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vendeurOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateOrderTotal = (order) => {
    let total = 0;
    order.products.forEach((product) => {
      if (product.productId) {
        total += product.productId.prix * product.quantity;
      }
    });
    return total;
  };

  const handleAcceptOrder = (orderId) => {
    // Ajoutez orderId à l'état local des commandes acceptées
    setAcceptedOrders([...acceptedOrders, orderId]);
  };

  return (
    <>
      <SideMenu />
      <div className="cart-container">
        <h2 className="cart-heading">Liste des commandes reçues</h2>
        {orders.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul className="cart-list">
            {orders.map((order) => {
              const orderTotal = calculateOrderTotal(order);
              return (
                <li key={order._id} className="order-item">
                  <div className="order-header">
                    <h3 className="order-id">Id de commende: {order._id}</h3>
                    <p className="buyer-id">
                      Id de l'acheteur: {order.id_acheteur}
                    </p>
                    <p className="order-status">
                      Statut: {order.status || "En attente"}
                    </p>
                  </div>
                  <ul className="product-list">
                    {order.products.map((product) => (
                      <li key={product._id} className="product-item">
                        <div className="product-item-content">
                          <h4 className="product-name">
                            Nom du produit:{" "}
                            {product.productId
                              ? product.productId.nomProduit
                              : "Produit sans nom"}
                          </h4>
                          <p className="product-quantity">
                            Quantité: {product.quantity}
                          </p>
                          <p className="product-price">
                            Prix:{" "}
                            {product.productId ? product.productId.prix : 0} DH
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="order-total">
                    Total de la commande: {orderTotal} DH
                  </p>
                  <div className="order-actions">
                    {!acceptedOrders.includes(order._id) && (
                      <button
                        className="action-button"
                        onClick={() => handleAcceptOrder(order._id)}
                      >
                        Accepter la commande
                      </button>
                    )}
                    {acceptedOrders.includes(order._id) && (
                      <span className="accepted-status">Commande acceptée</span>
                    )}
                  </div>
                  <hr className="divider" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default Cart;