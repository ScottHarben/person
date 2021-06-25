import React, { useState, useEffect } from "react";

export default function Person({ axios }) {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [errors, setErrors] = useState([]);

  function handleChange(e) {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "age":
        setAge(e.target.value);
        break;
      default:
        break;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errorList = [];
    if (name === "") {
      errorList.push("name");
    }
    if (age === "") {
      errorList.push("age");
    }
    setErrors(errorList);
    if (errorList.length > 0) {
      return false;
    } else {
      personAdd();
    }
  }

  function hasError(key) {
    return errors.indexOf(key) !== -1;
  }

  function handleDelete(id) {
    personDelete(id);
  }

  async function peopleGet() {
    try {
      const result = await axios.get("/");
      setPeople(result.data);
    } catch (error) {
      handleError(error);
    }
  }

  async function personAdd() {
    try {
      await axios.post(
        "/personAdd",
        {
          Name: name,
          Age: age,
        },
        { headers: authHeader() }
      );
      setName("");
      setAge(0);
      peopleGet();
    } catch (error) {
      handleError(error);
    }
  }

  async function personDelete(id) {
    try {
      await axios.delete("/personDelete", {
        data: {
          Id: id,
        },
        headers: authHeader(),
      });
      peopleGet();
    } catch (error) {
      handleError(error);
    }
  }

  function handleError(error) {
    if (error.response) {
      console.log("server responded with a status code outside of 2xx");
      console.log("status code: " + error.response.status);
      console.log("Error message:");
      console.log(error.message);
    } else if (error.request) {
      console.log("Request error: ");
      console.log(error.request);
    } else {
      console.log("Error: " + error.message);
    }
    console.log(error);
  }

  function authHeader() {
    const localUser = JSON.parse(localStorage.getItem("user"));
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    const user = localUser || sessionUser;
    if (user && user.token) {
      return { "x-access-token": user.token };
    } else {
      return {};
    }
  }

  useEffect(() => {
    (async function () {
      try {
        const result = await axios.get("/");
        setPeople(result.data);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [axios]);

  return (
    <div className="container mt-5">
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Name</label>
          <input
            type="text"
            className={
              hasError("name") ? "form-control is-invalid" : "form-control"
            }
            id="exampleInputEmail1"
            name="name"
            value={name}
            onChange={handleChange}
          />
          <div className={hasError("name") ? "invalid-feedback" : "invisible"}>
            Name cannot be blank
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Age</label>
          <input
            type="number"
            className={
              hasError("age") ? "form-control is-invalid" : "form-control"
            }
            id="exampleInputPassword1"
            name="age"
            value={age}
            onChange={handleChange}
          />
          <div className={hasError("age") ? "invalid-feedback" : "invisible"}>
            Age cannot be blank
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add person
        </button>
      </form>
      <table className="table mt-5">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.Id}>
              <td>{person.Name}</td>
              <td>{person.Age}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(person.Id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
