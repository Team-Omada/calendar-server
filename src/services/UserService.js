const bcrypt = require("bcrypt");
const { checkUniqueDb, insertUserDb } = require("../db/User");
const { BadRequest, GeneralError } = require("../utils/errors");

module.exports = {
  /**
   * Takes all req.body fields to ensure valid entries
   * Checks that email and username are unique values in DB
   *
   * @param {String} email from req.body
   * @param {String} username from req.body
   * @param {String} password from req.body
   *
   * @throws {BadRequest} if any criteria fails to validate
   */
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
      let result = await checkUniqueDb(email, username);
      if (result) {
        if (result.email === email) {
          throw new BadRequest(
            400,
            "That email is already being used.",
            "emailError"
          );
        } else if (result.username === username) {
          throw new BadRequest(
            400,
            "That username is already being used.",
            "nameError"
          );
        }
      }
    }
  },

  /**
   * Hashes the plaintext password using bcrypt with a salt of 10
   *
   * @param {String} password from req.body
   *
   * @returns {String} hashed password
   * @throws {GeneralError} 500 server error sent back to client, password wasn't hashed
   */
  async hashPassword(password) {
    const SALT_FACTOR = 10;
    try {
      const salt = await bcrypt.genSalt(SALT_FACTOR);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      console.log("Hash Error: ", err);
      throw GeneralError(
        500,
        "Something went wrong when creating your account!"
      );
    }
  },

  /**
   * Wrapper function for inserting a user into the DB
   * Avoids accessing data layer from controller
   * @param {String} email validated CSUSM student email address
   * @param {String} username validated unique username
   * @param {String} passhash hashed password
   *
   * @returns {Number} the userID of the user that was inserted
   */
  async createUser(email, username, passhash) {
    return await insertUserDb(email, username, passhash);
  },
};
