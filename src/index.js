/**
 * Program flow is as follows:
 * index.js =>
 * routes.js =>
 * ./controllers =>
 * ./services =>
 * ./db =>
 * Handle any thrown errors in ./controllers by sending appropriate status code
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes");
const { handleErrors } = require("./utils/errors");

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(
  cors({
    origin: isProduction ? process.env.CLIENT_HOSTNAME : "*",
  })
);
app.use(morgan("combined")); // middleware to log details of request to console
app.use(express.json()); // used for processing incoming JSON

app.use("/", router);

app.use(handleErrors);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
