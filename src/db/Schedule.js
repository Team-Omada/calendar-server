const pool = require("../utils/connection");
const { insertCoursesDb } = require("./Course");
const { insertSectionsDb } = require("./Section");
const { DatabaseError } = require("../utils/errors");

module.exports = {
  /**
   * Starts a MySQL transaction to insert a new schedule
   * Must insert into schedules, courses, schedule_has_courses tables on DB
   * A failure should rollback any changes made to each table listed
   *
   * @param {Number} userID of the user who is creating schedule
   * @param {Object} schedule contains info like semester, title
   * @param {Array} courses contains all info on the courses for this schedule
   *
   * @returns {Number} the ID of the schedule that was successfully inserted
   * @throws {DatabaseError} if any query happens to fail
   */
  async insertScheduleDb(userID, schedule, courses) {
    let transactionConn;
    try {
      transactionConn = await pool.getConnection();
    } catch (err) {
      throw DatabaseError(500, "Could not connect to database.", err);
    }

    const scheduleQuery = `
      INSERT INTO schedules (scheduleTitle, semester, semesterYear, userID)
      VALUES (?, ?, ?, ?)
    `;
    try {
      await transactionConn.query("START TRANSACTION");
      const [insertedSchedule] = await transactionConn.execute(scheduleQuery, [
        schedule.scheduleTitle,
        schedule.semester,
        schedule.semesterYear,
        userID,
      ]);
      await insertCoursesDb(transactionConn, courses);
      await insertSectionsDb(
        transactionConn,
        courses,
        insertedSchedule.insertId
      );
      await transactionConn.query("COMMIT");
      return insertedSchedule.insertId;
    } catch (err) {
      await transactionConn.query("ROLLBACK");
      throw new DatabaseError(
        500,
        "There was an issue creating your schedule.",
        err
      );
    } finally {
      await transactionConn.release();
    }
  },

  /**
   * Retrieves all schedules with user info and schedule info
   *
   * @returns {Array} with all schedule rows
   * @throws {DatabaseError} if the query could not be executed
   */
  async selectAllSchedulesDb() {
    const query = `
      SELECT users.userID, users.username, scheduleID, 
        datePosted, scheduleTitle, semester, semesterYear
      FROM users
      JOIN schedules ON schedules.userID = users.userID
      ORDER BY datePosted DESC LIMIT 10;
    `;
    try {
      const [results] = await pool.query(query);
      return results;
    } catch (err) {
      throw new DatabaseError(500, "Error fetching schedules.", err);
    }
  },

  /**
   * Retrieves a row with the following scheduleID
   *
   * @param {Number} scheduleID the id of the schedule to find
   *
   * @returns {Object} with row information, null if nothing found
   * @throws {DatabaseError} if the query could not be executed
   */
  async selectScheduleByIdDb(scheduleID) {
    const query = `
      SELECT users.userID, users.username, scheduleID, 
        datePosted, scheduleTitle, semester, semesterYear
      FROM users
      JOIN schedules ON schedules.userID = users.userID AND scheduleID = ?
    `;
    try {
      const [results] = await pool.execute(query, [scheduleID]);
      return results.length == 0 ? null : results[0];
    } catch (err) {
      throw new DatabaseError(500, "Error finding specific schedule.", err);
    }
  },

  async selectCoursesOnScheduleDb(scheduleID) {
    const query = `
      SELECT courses.courseID, instructor, courseName, startTime, endTime, 
        monday, tuesday, wednesday, thursday, friday, saturday, sunday
      FROM schedules
      JOIN schedule_has_courses ON schedules.scheduleID = schedule_has_courses.scheduleID 
        AND schedules.scheduleID = ?
      JOIN courses ON courses.courseID = schedule_has_courses.courseID;
    `;
    try {
      const [results] = await pool.execute(query, [scheduleID]);
      return results;
    } catch (err) {
      throw new DatabaseError(
        500,
        "Could not get courses attached to schedule.",
        err
      );
    }
  },
};
