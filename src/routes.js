const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");

router.post("/register", UserController.register);
router.get("/login", UserController.login);

// sample of how we would use checkAuthenticated function
// checkAuthenticated runs before the res.send() call
// if auth fails, the res.send() will never be reached
router.get("/home", UserController.checkAuthenticated, (req, res) => {
  res.send({ message: "You are authorized to see this!" });
});

module.exports = router;
