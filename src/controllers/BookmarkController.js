const {
  createBookmark,
  removeBookmark,
  retrieveBookmarks,
} = require("../services/BookmarkService");

module.exports = {
  // adds a bookmark for the requesting user
  async postBookmark(req, res, next) {
    const { userID } = req.userInfo;
    const { scheduleID } = req.params;
    try {
      await createBookmark(userID, scheduleID);
      res.send({
        message: "Bookmark created!",
      });
    } catch (err) {
      next(err);
    }
  },

  // deletes a bookmark for the requesting user
  async deleteBookmark(req, res, next) {
    const { userID } = req.userInfo;
    const { scheduleID } = req.params;
    try {
      await removeBookmark(userID, scheduleID);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  // gets all bookmarks
  async getBookmarks(req, res, next) {
    const { userID } = req.userInfo;
    try {
      const results = await retrieveBookmarks(userID);
      res.send({
        results,
      });
    } catch (err) {
      next(err);
    }
  },
};
