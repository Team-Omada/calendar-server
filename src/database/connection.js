require("dotenv").config();
const mysql = require("mysql");

// creates a pool of 5 connections
const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
});

module.exports = pool;
