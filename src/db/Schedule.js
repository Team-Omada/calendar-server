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
        schedule.title,
        schedule.semesterInfo.name,
        schedule.semesterInfo.year,
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
};