import React, { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { useAuth } from "../component_acheteur/useAuth";

function SideMenu() {
  const [token, setToken] = useState(null); 
const navigate=useNavigate() 
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



   const switchRole0 = async () => {
     try {
       await axios.put(
         "http://localhost:3000/user/switchRole0",
         { role: 0 },
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );
     } catch (error) {
       console.error(
         "Erreur lors de la mise à jour du rôle de l'utilisateur :",
         error
       );
     }
   };
  return (
    <div className="side-menu">
      <ul>
        <li>
          <Link to="/panier/dashboard">
            <span className="las la-user-alt"></span>
            <small>ajouter anonce</small>
          </Link>
        </li>
        <li>
          <Link to="/annonce">
            <span className="las la-user-alt"></span>
            <small>mes annonces</small>
          </Link>
        </li>
        <li>
          <Link to="/">
            <small onClick={switchRole0}>quitter</small>
          </Link>
        </li>
        <li>
          <Link to="/commendeVendeuse" className="active">
            <span className="las la-home"></span>
            <small>Commandes des clients </small>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideMenu;
