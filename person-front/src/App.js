import React, { Component } from "react";
import "./App.css";

const baseURL = "http://localhost:9000";

const axios = require("axios").create({
  baseURL: baseURL,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      name: "",
      age: 0,
      errors: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.hasError = this.hasError.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let errors = [];
    if (this.state.name === "") {
      errors.push("name");
    }
    if (this.state.age === "") {
      errors.push("age");
    }
    this.setState({
      errors: errors,
    });
    if (errors.length > 0) {
      return false;
    } else {
      this.personAdd();
    }
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleDelete(id) {
    this.personDelete(id);
  }

  handleError(error) {
    if (error.response) {
      console.log("server responded with a status code outside of 2xx");
      console.log("status code: " + error.response.status);
      console.log(error.message);
    } else if (error.request) {
      console.log("request error: ");
      console.log(error.request);
    } else {
      console.log("Error: " + error.message);
    }
    console.log(error);
  }

  async peopleGet() {
    try {
      const result = await axios.get("/");
      this.setState({
        people: result.data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async personAdd() {
    try {
      await axios.post("/personAdd", {
        Name: this.state.name,
        Age: this.state.age,
      });
      this.setState({
        name: "",
        age: 0,
      });
      this.peopleGet();
    } catch (error) {
      this.handleError(error);
    }
  }

  async personDelete(id) {
    try {
      await axios.delete("/personDelete", {
        data: {
          Id: id,
        },
      });
      this.peopleGet();
    } catch (error) {
      this.handleError(error);
    }
  }

  componentDidMount() {
    this.peopleGet();
  }

  render() {
    const people = this.state.people;
    return (
      <div className="container mt-5">
        <form className="w-50" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Name</label>
            <input
              type="text"
              className={
                this.hasError("name")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="exampleInputEmail1"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <div
              className={
                this.hasError("name") ? "invalid-feedback" : "invisible"
              }
            >
              Name cannot be blank
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Age</label>
            <input
              type="number"
              className={
                this.hasError("age")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="exampleInputPassword1"
              name="age"
              value={this.state.age}
              onChange={this.handleChange}
            />
            <div
              className={
                this.hasError("age") ? "invalid-feedback" : "invisible"
              }
            >
              Age cannot be blank
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            3rd time is the charm!
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
                    onClick={() => this.handleDelete(person.Id)}
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
}

export default App;
