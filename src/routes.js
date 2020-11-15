const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ScheduleController = require("./controllers/ScheduleController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// IMPORTANT: all of these routes should be authenticated
// some of these look a bit complicated, but I think this follows REST standards

// create a schedule
router.post(
  "/schedules",
  UserController.checkAuthenticated,
  ScheduleController.postSchedule
);

// get all schedules
router.get(
  "/schedules",
  UserController.checkAuthenticated,
  ScheduleController.getSchedules
);

// get a specific schedule
router.get(
  "/schedules/:scheduleID",
  UserController.checkAuthenticated,
  ScheduleController.getScheduleById
);

// delete a specific schedule
router.delete(
  "/schedules/:scheduleID",
  UserController.checkAuthenticated,
  ScheduleController.deleteSchedule
);

// update a specific schedule
router.put(
  "/schedules/:scheduleID",
  UserController.checkAuthenticated,
  ScheduleController.putSchedule
);

router.get("/schedules/:scheduleID/comments"); // get all comments from a particular schedule
router.post("/schedules/:scheduleID/comments"); // add a comment to a schedule
router.put("/schedules/:scheduleID/comments/:commentID"); // update an existing comment
router.delete("/schedules/:scheduleID/comments/:commentID"); // delete a comment from a schedule

router.get("/bookmarks/:userID"); // get bookmarks for a specific userID
router.post("/bookmarks"); // add a new bookmark
router.delete("/bookmarks/:userID/schedules/:scheduleID"); // delete a specific bookmark

module.exports = router;
