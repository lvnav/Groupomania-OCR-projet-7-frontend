import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, useLocation } from "react-router-dom";
require("./Login.css");

const Login = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { state } = useLocation();

  const login = (submitEvent) => {
    submitEvent.preventDefault();
    const userData = { email: null, password: null };
    const form = submitEvent.target;

    userData.email = form.email.value;
    userData.password = form.password.value;

    const jsonUserData = JSON.stringify(userData);
    axios
      .post("http://localhost:3001/user/login", jsonUserData, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        document.cookie = `authToken=${response.data.token}; sameSite=Strict`;
        localStorage.setItem("userId", response.data.userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main className="signupDiv">
      <form className="signupForm" onSubmit={login}>
        <h1 className="formTitle">Connexion</h1>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />

        <label htmlFor="password">Mot de passe</label>
        <input type="password" id="password" />

        <button className="submitButton" type="submit">
          Se connecter
        </button>
      </form>
    </main>
  );
};

export default Login;