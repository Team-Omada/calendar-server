const { DatabaseError } = require("./errors");

module.exports = handleErrors = (err, req, res, next) => {
  // if it's a database related error, send a generic message defined in error
  // user doesn't need large error string in client
  if (err instanceof DatabaseError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  // otherwise all other errors for now can be handled like this
  return res.status(err.status).json({
    message: err.message,
    info: err.info,
  });
};
