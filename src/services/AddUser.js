// Middleware for server side validation
// Note that there is client side validation
// But it is always good to have both.
const { checkUniqueDb } = require("../db/User");
const { BadRequest } = require("../utils/errors");

module.exports = {
  async validateUser(email, username, password) {
    const emailPattern = /^[A-Za-z]{2,5}[\d]{3}@cougars\.csusm\.edu$|^[A-Za-z]{2,}@csusm\.edu$/;
    const userPattern = /^[\w]{3,20}$/;
    const passPattern = /^.{8,}$/;

    // if the regex pattern is not matched, throw an error
    if (!emailPattern.test(email)) {
      throw BadRequest(400, "Must be a CSUSM student email.", "emailError");
    } else if (!userPattern.test(username)) {
      throw new BadRequest(
        400,
        "Must contain only letters, digits, or underscores.",
        "nameError"
      );
    } else if (!passPattern.test(password)) {
      throw new BadRequest(
        400,
        "Password must be greater than 8 characters",
        "passwordError"
      );
    } else {
      // check if the email or username is already in use
      let results = await checkUniqueDb(email, username);
      if (results.length > 0) {
        if (results[0].email === email) {
          throw new BadRequest(
            400,
            "That email is already being used.",
            "emailError"
          );
        } else if (results[0].username === username) {
          throw new BadRequest(
            400,
            "That username is already being used.",
            "nameError"
          );
        }
      }
    }
  },
};
