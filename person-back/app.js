const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const nodemailer = require("nodemailer");

const port = process.env.PORT || 9000;
const app = express();

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "Person",
  user: "superuser",
  password: "superuser",
});

connection.connect();

function personGet(req, res) {
  connection.query("call spGUIPersonGet()", (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    } else {
      res.send(results[0]);
    }
  });
}

function personAdd(req, res) {
  connection.query(
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

function personDelete(req, res) {
  connection.query(
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

function signup(req, res) {
  const username = req.body.Username;
  const email = req.body.Email;
  const password = req.body.Password;
  const guid = req.body.GUID;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      handleError(res, err, 500, "Error hashing password");
    } else {
      connection.query(
        "call spGUIUserAdd(?,?,?,?)",
        [username, email, hash, guid],
        (error, results, fields) => {
          if (error) {
            handleError(res, err, 500, "Error adding user");
          } else {
            res.send(results);
          }
        }
      );
    }
  });
}

async function sendEmail(req, res) {
  const email = req.body.Email;
  const guid = req.body.GUID;
  let transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "apikey", //ENV
      pass:
        "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", //ENV
    },
  });
  try {
    await transporter.sendMail({
      from: '"Scott Harben" <scottharben@gmail.com>', // ENV
      to: email,
      subject: "Account Verification", // Subject line
      html:
        '<a href="http://localhost:3000/activate/' +
        email +
        "/" +
        guid +
        '">Verify email</a>', // html body
    });
  } catch (error) {
    handleError(res, error, 500, "Error sending email");
  }
}

function checkUsername(req, res) {
  connection.query(
    "call spGUICheckUsername(?)",
    req.query.Username,
    (error, results, fields) => {
      if (error) {
        handleError(res, error, 500, "Error checking username");
      } else {
        res.send(results);
      }
    }
  );
}

function checkEmail(req, res) {
  connection.query(
    "call spGUICheckEmail(?)",
    req.query.Email,
    (error, results, fields) => {
      if (error) {
        handleError(res, error, 500, "Error checking email");
      } else {
        res.send(results);
      }
    }
  );
}

function activate(req, res) {
  connection.query(
    "call spGUIUserActivate(?)",
    req.body.GUID,
    (error, results, fields) => {
      if (error) {
        handleError(res, error, 500, "Error activating user");
      } else {
        res.send(results);
      }
    }
  );
}

function login(req, res) {
  connection.query(
    "call spGUIUserGet(?)",
    req.body.Username,
    (error, results, fields) => {
      if (error) {
        handleError(res, error, 500, "Error getting user by username");
      } else {
        const user = results[0][0];
        const passwordHash = user.PasswordHash;
        bcrypt.compare(req.body.Password, passwordHash, (err, result) => {
          if (err) {
            handleError(res, err, 500, "Error comparing passwords");
          }
          if (result) {
            jwt.sign(
              { username: user.Username, admin: user.IsAdmin },
              "superSecret",
              (err, token) => {
                if (err) {
                  handleError(res, err, 500, "Error signing JWT");
                } else {
                  res.send({ username: req.body.Username, token: token });
                }
              }
            );
          } else {
            res.status(403).send({
              success: false,
              message: "Invalid username or password",
            });
          }
        });
      }
    }
  );
}

function handleError(res, error, status, errorMessage) {
  console.log(errorMessage);
  console.log(error);
  res.status(status).send(errorMessage);
}

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  personGet(req, res);
});

app.post("/personAdd", (req, res) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, "superSecret", (err, decoded) => {
      if (err) console.log(err);
      else if (decoded) personAdd(req, res);
      else console.log("failed varification");
    });
  } else {
    console.log("forbidden");
  }
});

app.delete("/personDelete", (req, res) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, "superSecret", (err, decoded) => {
      if (err) console.log(err);
      else if (decoded) {
        if (decoded.admin !== 1) console.log("admin only");
        else personDelete(req, res);
      } else console.log("failed varification");
    });
  } else {
    console.log("forbidden");
  }
});

app.post("/signup", (req, res) => {
  signup(req, res);
});

app.post("/sendEmail", (req, res) => {
  sendEmail(req, res);
});

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/activate", (req, res) => {
  activate(req, res);
});

app.get("/checkUsername", (req, res) => {
  checkUsername(req, res);
});

app.get("/checkEmail", (req, res) => {
  checkEmail(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
