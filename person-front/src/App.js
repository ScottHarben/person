import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Index from "./components/index";
import Welcome from "./components/welcome";
import Person from "./components/person";
import Signup from "./components/signup";
import Login from "./components/login";
import Activate from "./components/activate";
import PrivateRoute from "./components/privateRoute";
import checkStorageForUser from "./components/checkStorageForUser";
import Error from "./components/error";

const axios = require("axios").create({
  baseURL: "http://localhost:9000",
});

export default function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const { user } = checkStorageForUser();
    setUser(user);
  }, []);

  function handleUserChange(user) {
    setUser(user);
  }

  return (
    <Router>
      <Navbar user={user} handleUserChange={handleUserChange} />
      <Switch>
        <PrivateRoute exact path="/">
          <Index user={user} axios={axios} />
        </PrivateRoute>
        <Route path="/welcome">
          <Welcome />
        </Route>
        <Route path="/signup">
          <Signup axios={axios} />
        </Route>
        <Route path="/login">
          <Login axios={axios} handleUserChange={handleUserChange} />
        </Route>
        <Route path="/activate/:email/:guid">
          <Activate axios={axios} />
        </Route>
        <Route path="/error">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}
