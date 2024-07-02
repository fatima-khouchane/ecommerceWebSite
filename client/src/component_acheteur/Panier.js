import React, { useEffect, useState } from "react";
import "./panier.css";
import Header from "./Header";
import { useAuth } from "./useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import PaidOrders from "./PaidOrders";

function Panier() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false); 
  const { token, username } = useAuth();

  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const fetchCartData = () => {
    if (token) {
      axios
        .get("http://localhost:3000/unpaidOrders", config)
        .then((response) => {
          const orders = response.data;
          if (orders.length > 0) {
            const firstElement = orders[0];
            console.log("Fetched unpaid order:", firstElement);

            if (firstElement && firstElement.products) {
              setCart(firstElement.products);
              setTotal(calculateTotal(firstElement.products));
              setOrderId(firstElement._id);
            } else {
              console.error("No products found in response");
            }
          } else {
            console.error("No unpaid orders found");
          }
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [token]);

  const calculateTotal = (products) => {
    let total = 0;
    products.forEach((product) => {
      total += product.productId.prix * product.quantity;
    });
    return total;
  };

  const handleConfirmOrder = () => {
    if (window.confirm("Êtes-vous sûr de vouloir confirmer la commande?")) {
      console.log("Order ID to confirm:", { orderId });

      axios
        .put("http://localhost:3000/api/confirmOrder", { orderId }, config)
        .then((response) => {
          console.log(response.data);
          setOrderConfirmed(true); 
        })
        .catch((error) => {
          console.error("Error confirming order:", error);
        });
    } else {
      console.log("Commande non confirmée par l'utilisateur.");
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Product removed from cart:", productId);
      fetchCartData();
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  return (
    <>
      <Header />
      <section id="cart" className="section-p1">
        {token ? (
          <h3 style={{ marginTop: "20px", padding: "20px" }}>
            Bienvenue {username}
          </h3>
        ) : (
          <h3
            style={{
              display: "inline-block",
              marginRight: "10px",
              marginTop: "14px",
            }}
          >
            Bienvenue, Vous devez vous
            <Link
              to="/login"
              style={{
                display: "inline-block",
                color: "red",
                textDecoration: "underline",
              }}
            >
              connecter
            </Link>
            pour procéder au paiement.
          </h3>
        )}

        {orderConfirmed ? (
          <h3 style={{ textAlign: "center" }}>
            Merci! Votre commande a été confirmée.
          </h3>
        ) : (
          <>
            <table width="100%">
              <thead>
                <tr>
                  <td>Remove</td>
                  <td>Image</td>
                  <td>Product</td>
                  <td>Price</td>
                  <td>Quantity</td>
                  <td>Subtotal</td>
                </tr>
              </thead>
              <tbody>
                {cart &&
                  cart.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <a
                          href="#"
                          onClick={() =>
                            handleRemoveProduct(product.productId._id)
                          }
                        >
                          <i
                            className="fas fa-times-circle"
                            style={{
                              color: "red",
                              fontSize: "20px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          ></i>
                        </a>
                      </td>

                      <td>
                        <img
                          id="imgCommender"
                          src={
                            product.productId ? product.productId.imageUrl : ""
                          }
                          alt=""
                        />
                      </td>
                      <td>
                        {product.productId
                          ? product.productId.nomProduit
                          : "Produit sans nom"}
                      </td>
                      <td>
                        {product.productId ? product.productId.prix : "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {product.quantity}
                      </td>
                      <td>
                        {product.productId
                          ? product.productId.prix * product.quantity
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="subtotal">
              <h3>Cart Totals</h3>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{total} DH</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className="normal" onClick={handleConfirmOrder}>
                Proceed to checkout
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Panier;
