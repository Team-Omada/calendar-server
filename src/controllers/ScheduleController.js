const {
  createSchedule,
  validateScheduleInfo,
  validateCourseInfo,
  searchAllSchedules,
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

  // gets all schedules with associated user info with specified limit
  // if request has query strings, do a full search on tables
  // NOTE: pagination is done on scheduleID index rather than LIMIT, OFFSET
  //  This means page numbers are arbitrary and based on the last seen ID's in the client
  async getSchedules(req, res, next) {
    const limit = 9; // the actual limit + 1, accounts for next/prev pagination
    const { userID } = req.userInfo;
    let prevID, nextID;
    let results = [];
    try {
      results = await searchAllSchedules(userID, req.query, limit);
      const convertPrev = Number(req.query.prev);
      const convertNext = Number(req.query.next);
      // if we get limit back, then that means we need a prev and next id
      if (results.length === limit) {
        if (req.query.prev) {
          nextID = convertPrev;
          results.splice(0, 1);
          prevID = results[0].scheduleID;
        } else {
          // if on the first page initially or clicking next
          nextID = results[results.length - 1].scheduleID;
          prevID = convertNext;
          results.pop();
        }
      } else if (results.length > 0 && req.query.prev) {
        // if on the first page again
        nextID = convertPrev;
      } else if (results.length > 0 && req.query.next) {
        // if on the last possible page
        prevID = convertNext;
      }
      res.send({
        prevID,
        nextID,
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
