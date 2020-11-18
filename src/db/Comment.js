const pool = require("../utils/connection");
const { DatabaseError } = require("../utils/errors");

module.exports = {
  /**
   * Inserts comment on particular schedule with associated user
   *
   * @param {Number} userID of user that is posting comment
   * @param {Number} scheduleID of schedule where comment is being posted
   * @param {String} text the comment to insert
   *
   * @returns {Number} the ID of the inserted comment
   * @throws {DatabaseError} if the query fails
   */
  async insertCommentDb(userID, scheduleID, text) {
    const query = `
      INSERT INTO comments (userID, scheduleID, text)
      VALUES (?, ?, ?);
    `;
    try {
      const [results] = await pool.execute(query, [userID, scheduleID, text]);
      return results.insertId;
    } catch (err) {
      throw new DatabaseError(500, "Could not post comment.", err);
    }
  },
};
