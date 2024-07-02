import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./signup.css"; 

function SignUp() {
 const [name, setName] = useState();
 const [email, setEmail] = useState();
 const [password, setPassword] = useState();
 const navigate = useNavigate();

 const handleSubmit = (e) => {
   e.preventDefault();
   axios
     .post("http://localhost:3000/register", { name, email, password })
     .then((result) => {
       console.log(result);
       navigate("/login");
       console.log('okkkkkkkkkkkkkkkkkkkkkkkkkk')
     })
     .catch((err) => console.log(err));
 };


  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <div className="form-group">
          <label htmlFor="name"> Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" onClick={handleSubmit}>
          Sign Up
        </button>
      </form>
      <div>
        <Link to="/">
          <i className="fa fa-home"></i> Acceuil
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
