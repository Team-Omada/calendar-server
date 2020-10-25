require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./database/connection");
const pool = require("./database/connection");
// const router = require("./router");
const app = express();

app.use(cors());
app.use(morgan("combined")); // middleware to log details of request to console
app.use(express.json()); // used for processing incoming JSON

// TODO: Split routes into separate module (router.js) in root.
// app.use('/', router); once module has been created
app.post("/register", (req, res) => {
  res.send({
    message: `Testing that POST is working`,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  });
});

// testing that database is connected
pool.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
