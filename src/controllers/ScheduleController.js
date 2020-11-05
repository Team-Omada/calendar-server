const {
  createSchedule,
  validateScheduleInfo,
  validateCourseInfo,
} = require("../services/ScheduleService");

module.exports = {
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
};
