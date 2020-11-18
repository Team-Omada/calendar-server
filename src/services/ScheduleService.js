const {
  insertScheduleDb,
  selectAllSchedulesDb,
  selectScheduleByIdDb,
  deleteScheduleDb,
  updateScheduleDb,
  checkScheduleExistsDb,
} = require("../db/Schedule");
const { formatCourses } = require("../utils/formatters");
const { BadRequest, NotFound } = require("../utils/errors");

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
   * Again, a wrapper to keep data section separate, gets all schedule entries in DB
   *
   * @returns {Array} of all rows returned
   */
  async retrieveSchedules() {
    return await selectAllSchedulesDb();
  },

  async updateSchedule(userID, scheduleID, schedule, courses) {
    if ((await checkScheduleExistsDb(userID, scheduleID)) > 0) {
      await updateScheduleDb(userID, scheduleID, schedule, courses);
    } else throw new NotFound(404, "Unauthorized or schedule doesn't exist.");
  },

  /**
   * Deletes schedule only if user is the owner
   *
   * @param {Number} userID of user making the delete request
   * @param {Number} scheduleID of schedule to delete
   *
   * @throws {NotFound} if the delete fails
   */
  async removeSchedule(userID, scheduleID) {
    if ((await deleteScheduleDb(userID, scheduleID)) > 0) return;
    else throw new NotFound(404, "Unauthorized or schedule doesn't exist.");
  },

  /**
   * Gets a schedule and its courses given a scheduleID
   *
   * @param {Number} scheduleID the id of the schedule to find
   *
   * @returns {Object} containing schedule info if found, null if not found
   * @throws {NotFound} if the schedule was not found
   */
  async retrieveScheduleById(scheduleID) {
    const results = await selectScheduleByIdDb(scheduleID);
    if (!results) {
      throw new NotFound(404, "That schedule was not found.", scheduleID);
    } else {
      const scheduleInfo = results[0]; // used for extracting schedule/user info
      const formattedCourses = formatCourses(results);
      return {
        userID: scheduleInfo.userID,
        username: scheduleInfo.username,
        scheduleID: scheduleInfo.scheduleID,
        datePosted: scheduleInfo.datePosted,
        scheduleTitle: scheduleInfo.scheduleTitle,
        semester: scheduleInfo.semester,
        semesterYear: scheduleInfo.semesterYear,
        courses: formattedCourses,
      };
    }
  },

  /**
   * Validates that all fields for a schedule row are provided
   *
   * @param {Object} schedule contains title and semester info about a schedule
   *
   * @throws {BadRequest} if title or semester is not provided or semester formatted wrong
   */
  validateScheduleInfo(schedule) {
    const { scheduleTitle = "", semester = "", semesterYear = "" } = schedule;
    const semesterPattern = /^(Fall|Spring|Summer|Winter)$/;
    // TODO: add title regex if needed?
    if (!scheduleTitle) {
      throw new BadRequest(400, "A title must be provided.", "titleError");
    } else if (!semesterYear) {
      throw new BadRequest(
        400,
        "A semester year must be provided.",
        "yearError"
      );
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
    const timePattern = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
    const dayPattern = /^(mon|tues|wednes|thurs|fri|satur|sun){1}(day){1}$/;

    // if there are duplicate courses, throw an error
    // there could be reason for duplicates (waitlist), however it does not work for our DB model
    const allCourseIds = courses.map((course) => course.courseID);
    if (courses.length !== new Set(allCourseIds).size) {
      throw new BadRequest(400, "Courses should be unique!");
    }
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
      } else if (!courseName || !instructor || days.length == 0) {
        throw new BadRequest(
          400,
          `Missing info for course: ${courseID}`,
          courseID
        );
      } else if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
        throw new BadRequest(
          400,
          `Times are not correctly formatted for course: ${courseID}`,
          courseID
        );
      } else {
        days.forEach((day) => {
          if (!dayPattern.test(day.toLowerCase())) {
            throw new BadRequest(
              400,
              "One or more days formatted wrong.",
              courseID
            );
          }
        });
      }
    });
  },
};
