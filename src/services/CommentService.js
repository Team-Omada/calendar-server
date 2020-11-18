const { te } = require("date-fns/locale");
const {
  insertCommentDb,
  selectAllScheduleCommentsDb,
  deleteCommentDb,
  updateCommentDb,
} = require("../db/Comment");
const { BadRequest, NotFound } = require("../utils/errors");

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
   * Deletes a comment from a schedule given that user owns that comment
   *
   * @param {Number} userID of user requesting deletion
   * @param {Number} scheduleID of schedule to delete from
   * @param {Number} commentID of comment to delete
   *
   * @throws {NotFound} if the user doesn't own the comment or it doesn't exist
   */
  async removeComment(userID, scheduleID, commentID) {
    if ((await deleteCommentDb(userID, scheduleID, commentID)) > 0) return;
    else throw new NotFound(404, "Unauthorized or comment doesn't exist.");
  },

  /**
   * Updates a comment on a schedule given that the user owns that comment
   *
   * @param {Number} userID of user trying to edit comment
   * @param {Number} scheduleID of schedule update is occuring on
   * @param {Number} commentID of comment to edit
   * @param {String} text validated comment to update
   *
   * @throws {NotFound} if the comment doesn't exist or the user doesn't own the comment
   */
  async updateComment(userID, scheduleID, commentID, text) {
    if ((await updateCommentDb(userID, scheduleID, commentID, text)) > 0)
      return;
    else throw new NotFound(404, "Unauthorized or comment doesn't exist.");
  },

  /**
   * Imposes hard limit of 350 characters per comment since it's CSUSM's RDS instance
   *
   * @param {String} text comment text to validate
   *
   * @throws {BadRequest} if comment fails to validate
   */
  validateComment(text) {
    if (text.length > 350 || text.length === 0) {
      throw new BadRequest(400, "Comment should only be 350 characters.");
    }
  },
};
