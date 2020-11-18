const {
  createComment,
  validateComment,
} = require("../services/CommentService");

module.exports = {
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
};
