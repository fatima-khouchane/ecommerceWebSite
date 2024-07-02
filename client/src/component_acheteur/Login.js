  import React, { useState } from "react";
  import { Link } from "react-router-dom";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
import "./login.css"; 

  const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post("http://localhost:3000/login", { email, password })
        .then((result) => {
          const token = result.data.token;
          const username = result.data.username;


          console.log(result);
        if (token) {
         
          localStorage.setItem("token", token); 
             localStorage.setItem("username", username); 

          navigate("/");
                    console.log(result.data.username);

        } else {
          navigate("/signup");
          alert("You are not registered to this service");
        }
        })
        .catch((err) => console.log(err));
    };
    return (
      <>
        <div className="login-box-body">
          <p className="login-box-msg">Sign in </p>

          <form >
            <div className="form-group has-feedback">
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div className="form-group has-feedback">
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <span className="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div className="row">
              <div className="col-xs-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-flat" onClick={handleSubmit}
                >
                  <i className="fa fa-sign-in"></i> Sign In
                </button>
              </div>
            </div>
          </form>
          <br />
          <br />
          <Link to="/signup" className="text-center">
            Register 
          </Link>
          <br />
          <Link to="/">
            <i className="fa fa-home"></i> Accueil
          </Link>
        </div>
      </>
    );
  };

  export default Login;
