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
const handleErrors = require("./utils/handleErrors");
const app = express();

app.use(cors());
app.use(morgan("combined")); // middleware to log details of request to console
app.use(express.json()); // used for processing incoming JSON

// TODO: once routes get out of hand, we should refactor.
// Each route such as "/bookmark" should have its own file
// However, routes.js should not be too large as everything is broken into components
app.use("/", router);

app.use(handleErrors);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
