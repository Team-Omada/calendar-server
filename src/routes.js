const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// some of these look a bit complicated, but I think this follows REST standards
router.get("/schedules"); // get all schedules
router.post("/schedules"); // create a schedule
router.get("/schedules/:scheduleID"); // get a specific schedule
router.delete("/schedules/:scheduleID"); // delete a specific schedule
router.put("/schedules/:scheduleID"); // update a specific schedule

router.post("/schedules/:scheduleID/comments"); // add a comment to a schedule
router.put("/schedules/:scheduleID/comments/:commentID"); // update an existing comment
router.delete("/schedules/:scheduleID/comments/:commentID"); // delete a comment from a schedule

router.get("/bookmarks/:userID"); // get bookmarks for a specific userID
router.post("/bookmarks"); // add a new bookmark
router.delete("/bookmarks/:userID/schedules/:scheduleID"); // delete a specific bookmark

// sample of how we would use checkAuthenticated function
// checkAuthenticated runs before the res.send() call
// if auth fails, the res.send() will never be reached
router.get("/home", UserController.checkAuthenticated, (req, res) => {
  res.send({ message: "You are authorized to see this!" });
});

module.exports = router;
