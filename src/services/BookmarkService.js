const {
  insertBookmarkDb,
  deleteBookmarkDb,
  selectUserBookmarks,
} = require("../db/Bookmark");
const { BadRequest } = require("../utils/errors");
module.exports = {
  /**
   * Creates a bookmark for the user
   *
   * @param {Number} userID of user adding bookmark
   * @param {Number} scheduleID of bookmark to be adding
   */
  async createBookmark(userID, scheduleID) {
    await insertBookmarkDb(userID, scheduleID);
  },

  /**
   * Deletes a bookmark if the user requesting deletion owns bookmark
   *
   * @param {Number} userID of user adding bookmark
   * @param {Number} scheduleID of bookmark to be adding
   *
   * @throws {BadRequest} if user does not own the bookmark
   */
  async removeBookmark(userID, scheduleID) {
    if ((await deleteBookmarkDb(userID, scheduleID)) > 0) return;
    else throw new BadRequest(400, "Unauthorized or bookmark doesn't exist.");
  },

  /**
   * Gets all bookmarks from a requesting user in the same way we do for getting all schedules
   *
   * @param {Number} userID of user requesting all of their bookmarks
   *
   * @returns {Array} of all schedules user has bookmarked with corresponding info
   */
  async retrieveBookmarks(userID) {
    return await selectUserBookmarks(userID);
  },
};
