const pool = require("../utils/connection");
const { DatabaseError } = require("../utils/errors");

module.exports = {
  /**
   * Inserts a bookmark given a schedule and requesting user
   *
   * @param {Number} userID of user adding bookmark
   * @param {Number} scheduleID of bookmark to be adding
   *
   * @throws {DatabaseError} if query fails or there is a duplicate (PK)
   */
  async insertBookmarkDb(userID, scheduleID) {
    const query = `
      INSERT INTO users_bookmark_schedules (userID, scheduleID)
      VALUES (?, ?)
    `;
    try {
      await pool.execute(query, [userID, scheduleID]);
    } catch (err) {
      throw new DatabaseError(
        500,
        "Error adding bookmark.",
        "Possible duplicate or schedule doesn't exist."
      );
    }
  },

  /**
   * Deletes a bookmark if the user requesting deletion owns bookmark
   *
   * @param {Number} userID of user adding bookmark
   * @param {Number} scheduleID of bookmark to be adding
   *
   * @returns {Number} of rows updated (1 if success, 0 if not)
   * @throws {DatabaseError} if query fails
   */
  async deleteBookmarkDb(userID, scheduleID) {
    const query = `
      DELETE FROM users_bookmark_schedules
      WHERE userID = ? AND scheduleID = ?
    `;
    try {
      const [results] = await pool.execute(query, [userID, scheduleID]);
      return results.affectedRows;
    } catch (err) {
      throw new DatabaseError(500, "Error deleting bookmark.");
    }
  },

  /**
   * Gets all bookmarks from a requesting user in the same way we do for getting all schedules
   *
   * @param {Number} userID of user requesting all of their bookmarks
   *
   * @returns {Array} of all schedules user has bookmarked with corresponding info
   * @throws {DatabaseError} if query fails
   */
  async selectUserBookmarks(userID) {
    const query = `
      SELECT users.userID, users.username, users.email, schedules.scheduleID, 
        datePosted, scheduleTitle, semester, semesterYear, 
        GROUP_CONCAT(schedule_has_courses.courseID SEPARATOR ', ') as days
      FROM users
      JOIN schedules ON schedules.userID = users.userID
      JOIN schedule_has_courses ON schedules.scheduleID = schedule_has_courses.scheduleID
      JOIN users_bookmark_schedules ON users_bookmark_schedules.userID = ? 
        AND users_bookmark_schedules.scheduleID = schedules.scheduleID
      GROUP BY schedules.scheduleID
      ORDER BY schedules.datePosted DESC
      LIMIT 20;
    `;
    try {
      const [results] = await pool.execute(query, [userID]);
      return results;
    } catch (err) {
      throw new DatabaseError(500, "Error getting your bookmarks.");
    }
  },
};
