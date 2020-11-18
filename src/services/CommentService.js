const {
  insertCommentDb,
  selectAllScheduleCommentsDb,
} = require("../db/Comment");
const { BadRequest } = require("../utils/errors");

module.exports = {
  /**
   * Wrapper for inserting comment in case more logic is needed later
   *
   * @param {Number} userID of user that is posting comment
   * @param {Number} scheduleID of schedule where comment is being posted
   * @param {String} text the comment to insert
   *
   * @returns {Number} the ID of the inserted comment
   */
  async createComment(userID, scheduleID, text) {
    return await insertCommentDb(userID, scheduleID, text);
  },

  /**
   * Another wrapper for selecting all comments on a schedule
   *
   * @param {Number} scheduleID of schedule to get comments from
   *
   * @returns {Array} of all comments, empty array if schedule doesn't exist
   */
  async retrieveComments(scheduleID) {
    return await selectAllScheduleCommentsDb(scheduleID);
  },

  /**
   * Imposes hard limit of 350 characters per comment since it's CSUSM's RDS instance
   *
   * @param {String} text comment text to validate
   *
   * @throws {BadRequest} if comment fails to validate
   */
  validateComment(text) {
    if (text.length > 350) {
      throw new BadRequest(400, "Comment should only be 350 characters.");
    }
  },
};