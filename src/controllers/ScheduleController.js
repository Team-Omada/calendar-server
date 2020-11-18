const {
  createSchedule,
  validateScheduleInfo,
  validateCourseInfo,
  retrieveSchedules,
  retrieveScheduleById,
  removeSchedule,
  updateSchedule,
} = require("../services/ScheduleService");

module.exports = {
  // creates a schedule with associated course and section info
  async postSchedule(req, res, next) {
    const { scheduleTitle, semester, semesterYear, courses } = req.body;
    const schedule = { scheduleTitle, semester, semesterYear };
    const userID = req.userInfo.userID; // userID included in the JWT
    try {
      validateScheduleInfo(schedule);
      validateCourseInfo(courses);
      const scheduleID = await createSchedule(userID, schedule, courses);
      res.send({
        message: "Schedule added!",
        scheduleID,
      });
    } catch (err) {
      next(err);
    }
  },

  // gets all schedules with associated user info
  async getSchedules(req, res, next) {
    try {
      const results = await retrieveSchedules();
      res.send({
        results,
      });
    } catch (err) {
      next(err);
    }
  },

  // gets schedule given a specific ID
  async getScheduleById(req, res, next) {
    const { scheduleID } = req.params;
    try {
      const results = await retrieveScheduleById(scheduleID);
      res.send({
        ...results,
      });
    } catch (err) {
      next(err);
    }
  },

  // updates a schedule given a scheduleID
  async putSchedule(req, res, next) {
    const { scheduleID } = req.params;
    const { scheduleTitle, semester, semesterYear, courses } = req.body;
    const schedule = { scheduleTitle, semester, semesterYear };
    const userID = req.userInfo.userID;
    try {
      validateScheduleInfo(schedule);
      validateCourseInfo(courses);
      await updateSchedule(userID, scheduleID, schedule, courses);
      res.sendStatus(204); // no need to return body from put
    } catch (err) {
      next(err);
    }
  },

  // deletes a schedule given a scheduleID
  async deleteSchedule(req, res, next) {
    const { scheduleID } = req.params;
    const userID = req.userInfo.userID; // retrieved from JWT
    try {
      await removeSchedule(userID, scheduleID);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
