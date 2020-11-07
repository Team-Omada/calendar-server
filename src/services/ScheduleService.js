const {} = require("date-fns");
const { insertScheduleDb } = require("../db/Schedule");
const { BadRequest } = require("../utils/errors");

module.exports = {
  /**
   * Performs the appropriate INSERTS for creating a schedule
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

  /**
   * Validates that all fields for a schedule row are provided
   *
   * @param {Object} schedule contains title and semester info about a schedule
   *
   * @throws {BadRequest} if title or semester is not provided or semester formatted wrong
   */
  validateScheduleInfo(schedule) {
    const { title = "", semester = "" } = schedule;
    const semesterPattern = /^(Fall|Spring|Summer|Winter)$/;
    // TODO: add title regex if needed?
    if (!title) {
      throw new BadRequest(400, "A title must be provided.", "titleError");
    } else if (!semesterPattern.test(semester)) {
      throw new BadRequest(
        400,
        "A valid semester must be provided.",
        "semesterError"
      );
    }
  },

  /**
   * Validates all course info in the array before it is inserted
   *
   * @param {Array} courses of objects that contains course info
   *
   * @throws {BadRequest} if a particular field does not validate
   */
  validateCourseInfo(courses) {
    // based on CSUSM catalog, courses have 2-4 letters and a 3 digit identifier
    // 1000-level courses do not exist in the catalog
    const courseIdPattern = /^[A-Z]{2,4}[0-9]{3}$/;

    courses.forEach((course) => {
      const {
        courseID = "",
        courseName = "",
        instructor = "",
        days = [],
        startTime = "",
        endTime = "",
      } = course;
      if (!courseIdPattern.test(courseID)) {
        throw new BadRequest(
          400,
          "Must have 2-4 letters and a 3 digit identifier.",
          "courseIdError"
        );
      } else if (!courseName || !instructor || !days) {
        throw new BadRequest(400, `Missing info for course: ${courseID}`);
      } else if (!startTime || !endTime) {
        // TODO: check formatted dates correctly, we need to see what Vuetify calendar spits out first
        throw new BadRequest(
          400,
          `Times are not correctly formatted for course: ${courseID}`,
          "timeError"
        );
      }
    });
  },
};
