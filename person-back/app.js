const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const mysql = require("mysql");
const cors = require("cors");

var connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

connection.connect();

async function personGet(req, res) {
  await connection.query("call spGUIPersonGet()", (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    } else {
      res.send(results[0]);
    }
  });
}

async function personAdd(req, res) {
  await connection.query(
    "call spGUIPersonAdd(?,?)",
    [req.body.Name, req.body.Age],
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      } else {
        res.send(results[0]);
      }
    }
  );
}

async function personDelete(req, res) {
  await connection.query(
    "call spGUIPersonDelete(?)",
    req.body.Id,
    (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      } else {
        res.send(results[0]);
      }
    }
  );
}

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  personGet(req, res);
});

app.post("/personAdd", (req, res) => {
  personAdd(req, res);
});

app.delete("/personDelete", (req, res) => {
  personDelete(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
