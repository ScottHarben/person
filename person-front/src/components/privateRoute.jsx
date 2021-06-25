import React from "react";
import { Route, Redirect } from "react-router-dom";
import checkStorageForUser from "./checkStorageForUser";

export default function PrivateRoute({ children, location, path }) {
  function checkedForLoggedIn() {
    const { loggedIn } = checkStorageForUser();
    return loggedIn;
  }
  return (
    <Route
      path={path}
      render={() =>
        checkedForLoggedIn() ? (
          children
        ) : (
          <Redirect to={{ pathname: "/welcome", state: { from: location } }} />
        )
      }
    />
  );
}
