import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import EmailNotificaiton from "./emailNotification";

export default function Signup({ axios }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [errors, setErrors] = useState([]);
  const guid = uuidv4();
  let history = useHistory();

  function handleChange(e) {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value);
        checkLength("username", e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        checkLength("email", e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        checkLength("password", e.target.value);
        break;
      default:
        break;
    }
  }

  function checkLength(errorName, value) {
    let errorList = [...errors];
    const index = errorList.indexOf(errorName);
    if (value.length > 0 && index !== -1) {
      errorList.splice(index, 1);
      setErrors(errorList);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errorList = await checkForErrors();
    if (errorList.length > 0) {
      return false;
    } else {
      const result = await signup();
      if (result) {
        sendEmail(email, guid);
        // sessionStorage.setItem("user", JSON.stringify(response.data));
        // handleUserChange(response.data);
        history.push("/");
      } else {
        history.push("/error");
      }
    }
  }

  async function signup() {
    try {
      const response = await axios.post("/signup", {
        Username: username,
        Email: email,
        Password: password,
        GUID: guid,
      });
      if (response.data.affectedRows === 1) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async function sendEmail(email, guid) {
    try {
      await axios.post("/sendEmail", {
        Email: email,
        GUID: guid,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function checkForErrors() {
    let errorList = [];
    if (username === "") {
      errorList.push("username");
    }
    if (await checkUsername(username)) {
      errorList.push("usernameExists");
    }
    if (email === "") {
      errorList.push("email");
    }
    if (await checkEmail(email)) {
      errorList.push("emailExists");
    }
    if (password === "") {
      errorList.push("password");
    }
    setErrors(errorList);
    return errorList;
  }

  function hasError(key) {
    return errors.indexOf(key) !== -1;
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

  async function checkEmail(email) {
    try {
      const response = await axios.get("/checkEmail", {
        params: {
          Email: email,
        },
      });
      const emailExists = response.data[0][0];
      if (emailExists) {
        return true;
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }

  if (signedUp) {
    return (
      <EmailNotificaiton sendEmail={sendEmail} email={email} guid={guid} />
    );
  } else {
    return (
      <div className="card w-25 mt-5 mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title mb-4">Sign up</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="inputUsername">Username</label>
              <input
                type="text"
                className={
                  hasError("username") || hasError("usernameExists")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="inputUsername"
                name="username"
                value={username}
                onChange={handleChange}
              />
              <div
                className={hasError("username") ? "invalid-feedback" : "d-none"}
              >
                Username cannot be blank
              </div>
              <div
                className={
                  hasError("usernameExists") ? "invalid-feedback" : "d-none"
                }
              >
                Username already exists
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputEmail">Email</label>
              <input
                type="text"
                className={
                  hasError("email") || hasError("emailExists")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="inputEmail"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <div
                className={hasError("email") ? "invalid-feedback" : "d-none"}
              >
                Email cannot be blank
              </div>
              <div
                className={
                  hasError("emailExists") ? "invalid-feedback" : "d-none"
                }
              >
                Email in use by another account
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                className={
                  hasError("password")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="inputPassword"
                name="password"
                value={password}
                onChange={handleChange}
              />
              <div
                className={hasError("password") ? "invalid-feedback" : "d-none"}
              >
                Password cannot be blank
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Sign up with Email
            </button>{" "}
            <div className="mt-3">
              Already have an account?{" "}
              <Link className="ml-1" to="/login">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
