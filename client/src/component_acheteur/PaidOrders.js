import React, { useEffect, useState } from "react";
import "./PaidOrder.css";
import Header from "./Header";
import { useAuth } from "./useAuth";
import axios from "axios";
import { Link } from "react-router-dom";

function PaidOrders() {
  const [paidOrders, setPaidOrders] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3000/paidOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPaidOrders(response.data);
        })
        .catch((error) => {
          console.error("Error fetching paid orders:", error);
        });
    }
  }, [token]);


    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        "fr-FR",
        options
      );
      return formattedDate;
    };
  return (
    <>
      <Header />
      <section id="paid-orders" className="section-p1">
        {paidOrders.length === 0 ? (
          <>
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Aucune commande payée n'est disponible pour le moment.
            </p>
          </>
        ) : (
          <>
            <h3 style={{ textAlign: "center" }}>Les commende déja effectuer</h3>
            <table width="100%">
              <thead>
                <tr>
                  <th>image</th>
                  <th>nom produit</th>
                  <th>quantité</th>
                  <th>Total</th>
                  <th>date</th>
                </tr>
              </thead>
              <tbody>
                {paidOrders.map(
                  (order) =>
                    order.products &&
                    order.products.map((product) => (
                      <tr key={`${order._id}-${product._id}`}>
                        <td>
                          {product.productId && product.productId.imageUrl && (
                            <img
                              src={product.productId.imageUrl}
                              style={{ width: "90px" }}
                              alt={product.productId.nomProduit}
                            />
                          )}
                        </td>
                        <td>
                          {product.productId
                            ? product.productId.nomProduit
                            : "N/A"}
                        </td>
                        <td>{product.quantity}</td>
                        <td>{order.total} DH</td>
                        <td>{formatDate(order.createdAt)}</td>{" "}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
    </>
  );
}

export default PaidOrders;
