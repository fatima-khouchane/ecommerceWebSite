import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Panier from "./component_acheteur/Panier";
import Index from "./component_acheteur/Index";
import Login from "./component_acheteur/Login";
import SignUp from "./component_acheteur/SignUp";
import Dashboard from "./component_vendeuse/Dashboard";
// import AddAnonce from "./component_vendeuse/AddAnonce";
import Favoris from "./component_acheteur/FavoryProduct";
import PaidOrders from "./component_acheteur/PaidOrders";
import Commende from "./component_vendeuse/Commende";
import Annonces from "./component_vendeuse/MesAnnonce";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/panier/dashboard" element={<Dashboard />} />
        <Route path="/commendeVendeuse" element={<Commende />} />
        <Route path="/annonce" element={<Annonces />} />

        <Route path="/PaidOrders" element={<PaidOrders />} />

        <Route path="/Favoris" element={<Favoris />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
