const { createSchedule } = require("../services/ScheduleService");

module.exports = {
  async postSchedule(req, res, next) {
    const { userID, schedule, courses } = req.body;
    try {
      const scheduleID = await createSchedule(userID, schedule, courses);
      res.send({
        scheduleID,
      });
    } catch (err) {
      next(err);
    }
  },
};
