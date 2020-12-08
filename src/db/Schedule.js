const pool = require("../utils/connection");
const { insertCoursesDb } = require("./Course");
const { insertSectionsDb, deleteSectionsOnScheduleDb } = require("./Section");
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
      throw new DatabaseError(500, "Could not connect to database.");
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
        "There was an issue creating your schedule."
      );
    } finally {
      await transactionConn.release();
    }
  },

  /**
   * Starts a MySQL transaction to update schedule similar to insert above
   * This is very slow since we are deleting and resinserting course data on every put request
   * The simplest way to handle for now without writing individual patch routes and changing frontend
   *
   * @param {Number} userID of user requesting update
   * @param {Number} scheduleID of schedule to update
   * @param {Object} schedule all base info for a schedule
   * @param {Array} courses for all courses to replace in schedule
   */
  async updateScheduleDb(userID, scheduleID, schedule, courses) {
    let transactionConn;
    try {
      transactionConn = await pool.getConnection();
    } catch (err) {
      throw new DatabaseError(500, "Could not connect to database.");
    }

    const scheduleQuery = `
      UPDATE schedules
      SET scheduleTitle = ?, semester = ?, semesterYear = ?
      WHERE scheduleID = ? AND userID = ?;
    `;
    try {
      await transactionConn.query("START TRANSACTION");
      await transactionConn.execute(scheduleQuery, [
        schedule.scheduleTitle,
        schedule.semester,
        schedule.semesterYear,
        scheduleID,
        userID,
      ]);
      await deleteSectionsOnScheduleDb(transactionConn, scheduleID);
      await insertCoursesDb(transactionConn, courses);
      await insertSectionsDb(transactionConn, courses, scheduleID);
      await transactionConn.query("COMMIT");
    } catch (err) {
      await transactionConn.query("ROLLBACK");
      throw new DatabaseError(
        500,
        "There was an issue updating your schedule."
      );
    } finally {
      await transactionConn.release();
    }
  },

  /**
   * Retrieves all courses and schedule info with the following scheduleID
   * The query looks monstrous, but it is mostly columns!
   *
   * @param {Number} scheduleID the id of the schedule to find
   *
   * @returns {Array} of all courses associated with a particular user schedule, null if not found
   * @throws {DatabaseError} if the query could not be executed
   */
  async selectScheduleByIdDb(scheduleID) {
    const query = `
      SELECT users.userID, users.username, users.email, schedules.scheduleID, 
        datePosted, scheduleTitle, semester, semesterYear, 
        courses.courseID, instructor, courseName, startTime, endTime, 
        monday, tuesday, wednesday, thursday, friday, saturday, sunday
      FROM users
      JOIN schedules ON schedules.userID = users.userID AND scheduleID = ?
      JOIN schedule_has_courses ON schedules.scheduleID = schedule_has_courses.scheduleID 
        AND schedules.scheduleID = ?
      JOIN courses ON courses.courseID = schedule_has_courses.courseID;
    `;
    try {
      const [results] = await pool.execute(query, [scheduleID, scheduleID]);
      return results.length == 0 ? null : results;
    } catch (err) {
      throw new DatabaseError(500, "Error finding specific schedule.");
    }
  },

  /**
   * Deletes a schedule provided userID and scheduleID are correct
   *
   * @param {Number} userID of user making request
   * @param {Number} scheduleID of schedule to delete
   *
   * @returns {Number} of rows deleted (1 if success, 0 if not)
   * @throws {DatabaseError} if the query failed
   */
  async deleteScheduleDb(userID, scheduleID) {
    const query = `
      DELETE FROM schedules WHERE userID = ? AND scheduleID = ?;
    `;
    try {
      const [results] = await pool.execute(query, [userID, scheduleID]);
      return results.affectedRows;
    } catch (err) {
      throw new DatabaseError(500, "Error when deleting schedule.");
    }
  },

  /**
   * Helper query to check if particular schedule belongs to a specific user
   *
   * @param {Number} userID of user making request
   * @param {Number} scheduleID of schedule to check for ownership
   *
   * @returns {Number} length of results, so 1 if found, 0 if not found
   * @throws {DatabaseError} if the query failed
   */
  async checkScheduleExistsDb(userID, scheduleID) {
    const query = `
      SELECT 1 FROM schedules WHERE userID = ? AND scheduleID = ?
    `;
    try {
      const [results] = await pool.execute(query, [userID, scheduleID]);
      return results.length;
    } catch (err) {
      throw new DatabaseError(500, "Error when checking schedule existence.");
    }
  },
};
