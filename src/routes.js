const express = require("express");
const router = express.Router();
const authentication = require("./database/authentication");
const policies = require("./database/policies");

router.post("/register", policies.register, authentication.register);
router.get("/login", authentication.login);

module.exports = router;
