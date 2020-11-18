const {
  createComment,
  validateComment,
  retrieveComments,
} = require("../services/CommentService");

module.exports = {
  // inserts comment onto a schedule
  async postComment(req, res, next) {
    const { text } = req.body;
    const { userID } = req.userInfo;
    const { scheduleID } = req.params;
    try {
      validateComment(text);
      const commentID = await createComment(userID, scheduleID, text);
      res.send({
        message: "Comment posted!",
        commentID,
      });
    } catch (err) {
      next(err);
    }
  },

  // gets all comments attached to a schedule
  async getComments(req, res, next) {
    const { scheduleID } = req.params;
    try {
      const results = await retrieveComments(scheduleID);
      res.send({
        results,
      });
    } catch (err) {
      next(err);
    }
  },
};
