const { insertScheduleDb } = require("../db/Schedule");

module.exports = {
  /**
   * Splits courses into general course info and section info
   * Corresponds to our SQL table model
   *
   * @param {Number} userID the user creating the schedule
   * @param {Object} schedule contains information on schedule
   * @param {Array} courses contains all course info for particular schedule
   *
   * @returns {Number} the ID of the inserted schedule
   */
  async createSchedule(userID, schedule, courses) {
    return await insertScheduleDb(userID, schedule, courses);
  },
};
