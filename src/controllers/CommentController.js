const {
  createComment,
  validateComment,
  retrieveComments,
  removeComment,
  updateComment,
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

  // deletes a comment attached to schedule only if comment is owned by request
  async deleteComment(req, res, next) {
    const { commentID, scheduleID } = req.params;
    const { userID } = req.userInfo;
    try {
      await removeComment(userID, scheduleID, commentID);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },

  // updates a comment attached to a schedule only if the comment is owned by request
  async putComment(req, res, next) {
    const { commentID, scheduleID } = req.params;
    const { text } = req.body;
    const { userID } = req.userInfo;
    try {
      validateComment(text);
      await updateComment(userID, scheduleID, commentID, text);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  },
};
