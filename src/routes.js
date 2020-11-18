const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ScheduleController = require("./controllers/ScheduleController");
const CommentController = require("./controllers/CommentController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// IMPORTANT: all of these routes should be authenticated, but this could change
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

// get all comments from a particular schedule
router.get(
  "/schedules/:scheduleID/comments",
  UserController.checkAuthenticated,
  CommentController.getComments
);

// add a comment to a schedule
router.post(
  "/schedules/:scheduleID/comments",
  UserController.checkAuthenticated,
  CommentController.postComment
);

// update an existing comment
router.put(
  "/schedules/:scheduleID/comments/:commentID",
  UserController.checkAuthenticated,
  CommentController.putComment
);

// delete a comment from a schedule
router.delete(
  "/schedules/:scheduleID/comments/:commentID",
  UserController.checkAuthenticated,
  CommentController.deleteComment
);

router.get("/bookmarks/:userID"); // get bookmarks for a specific userID
router.post("/bookmarks"); // add a new bookmark
router.delete("/bookmarks/:userID/schedules/:scheduleID"); // delete a specific bookmark

module.exports = router;
