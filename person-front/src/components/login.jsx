import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function Login(props) {
  const { axios, handleUserChange } = props;
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();
  const location = useLocation();

  let showConfirmation = false;
  let email = "";
  if (location.state && location.state.userConfirmed) {
    showConfirmation = location.state.userConfirmed;
    email = location.state.email;
  }

  function handleChange(e) {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "rememberMe":
        setRememberMe(e.target.value);
        break;
      default:
        break;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (await checkUsername(username)) {
      await login();
    } else {
      setUserStatus("Invalid username or password");
    }
  }

  async function checkUsername(username) {
    try {
      const response = await axios.get("/checkUsername", {
        params: {
          Username: username,
        },
      });
      const userExists = response.data[0][0];
      if (userExists) {
        return true;
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }

  async function login() {
    try {
      const response = await axios.post("/login", {
        Username: username,
        Password: password,
      });
      sessionStorage.setItem("user", JSON.stringify(response.data));
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      handleUserChange(response.data);
      handleRedirect("/");
    } catch (error) {
      if (error.response.status === 403 && !error.response.data.success) {
        setUserStatus(error.response.data.message);
      } else {
        console.log(error.response.data);
      }
    }
  }

  function handleRedirect(redirect) {
    history.push(redirect);
  }

  return (
    <React.Fragment>
      {showConfirmation ? (
        <div
          class="alert alert-success w-25 mt-5 mx-auto"
          style={{ maxWidth: "400px" }}
          role="alert"
        >
          <strong>{email}</strong> confirmed. Log in to access your account.
        </div>
      ) : (
        <div></div>
      )}
      {userStatus ? (
        <div
          class="alert alert-danger w-25 mt-5 mx-auto"
          style={{ maxWidth: "400px" }}
          role="alert"
        >
          {userStatus}
        </div>
      ) : (
        <div></div>
      )}
      <div className="card w-25 mt-5 mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title mb-4">Log in</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="inputUsername">Username</label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rememberMeCheck"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleChange}
              />
              <label className="custom-control-label" htmlFor="rememberMeCheck">
                Keep me signed in on this device
              </label>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Log in
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
