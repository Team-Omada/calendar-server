// https://codeburst.io/better-error-handling-in-express-js-b118fc29e9c7

// General error class with a default status code of 500
class GeneralError extends Error {
  constructor(
    status = 500,
    message = "An unknown error occured.",
    info = "", // use this field to send which field caused the error on client
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
class Unauthorized extends GeneralError {} // Unauthorized (401) use when auth fails
// when resource doesn't exist and is not requested in query param (404)
// ex: .../schedules/24, where schedule with id of 24 is listed on dashboard but not found
class NotFound extends GeneralError {}

module.exports = {
  GeneralError,
  BadRequest,
  DatabaseError,
  Unauthorized,
  NotFound,
  handleErrors(err, req, res, next) {
    console.log(err);
    // all errors can be handled like this for now
    return res.status(err.status).send({
      message: err.message,
      info: err.info,
    });
  },
};
