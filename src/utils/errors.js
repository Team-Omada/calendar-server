// https://codeburst.io/better-error-handling-in-express-js-b118fc29e9c7

// General error class with a default status code of 500
class GeneralError extends Error {
  constructor(
    status = 500,
    message = "An unknown error occured.",
    info = "",
    ...params
  ) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);
    this.status = status;
    this.message = message;
    this.info = info; // use in
  }
}

class BadRequest extends GeneralError {} // Bad Request (400)
class DatabaseError extends GeneralError {} // Any error within ./models (500)

module.exports = {
  GeneralError,
  BadRequest,
  DatabaseError,
};
