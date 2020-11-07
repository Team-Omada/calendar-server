const {
  createSchedule,
  validateScheduleInfo,
  validateCourseInfo,
  retrieveSchedule,
  retrieveScheduleById,
} = require("../services/ScheduleService");

module.exports = {
  // creates a schedule with associated course and section info
  async postSchedule(req, res, next) {
    const { userID, schedule, courses } = req.body;
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
      const results = await retrieveSchedule();
      res.send({
        results,
      });
    } catch (err) {
      next(err);
    }
  },

  // gets schedule given a specific ID
  async getScheduleId(req, res, next) {
    const { scheduleID } = req.params;
    try {
      const results = await retrieveScheduleById(scheduleID);
      res.send({
        results,
      });
    } catch (err) {
      next(err);
    }
  },
};
