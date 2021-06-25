import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, handleUserChange }) {
  const username = user.username;

  function handleLogout() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    handleUserChange({});
  }

  const logOutVisible = username ? "" : " d-none";
  const logOutClass = "navbar-text text-white ml-3 btn-link" + logOutVisible;
  const logInVisible = username ? " d-none" : " ";
  const logInClass = "navbar-text text-white ml-3 btn-link" + logInVisible;
  const signUpVisible = username ? " d-none" : "";
  const signUpClass = "navbar-text text-white ml-3 btn-link" + signUpVisible;
  return (
    <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
      <Link to="/" className="navbar-brand text-white mb-0 mr-auto h1">
        Person
      </Link>
      <span className="navbar-text text-white">{username}</span>
      <Link to="/welcome" className={logOutClass} onClick={handleLogout}>
        Log out
      </Link>
      <Link to="/login" className={logInClass}>
        Log in
      </Link>
      <Link to="/signup" className={signUpClass}>
        Sign Up
      </Link>
    </nav>
  );
}
