const express = require("express");
const router = express.Router();
const authentication = require("./database/authentication");

router.post("/register", authentication.register);
router.get("/login", authentication.login);

module.exports = router;
