const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { getUserByEmailDb } = require("../db/User");
const { Unauthorized, GeneralError } = require("../utils/errors");

module.exports = {
  /**
   * Finds email account and compares submitted password with hash
   *
   * @param {String} email user entered email to find
   * @param {String} password user entered password to verify
   *
   * @returns {Object} account info if account is found and passwords match, otherwise:
   * @throws {Unauthorized} when either check fails
   */
  async checkCredentials(email, password) {
    let accountInfo = await getUserByEmailDb(email);
    if (!accountInfo) {
      throw new Unauthorized(401, "The email or password is incorrect.");
    }
    const match = await bcrypt.compare(password, accountInfo.passhash);
    if (match) {
      return accountInfo;
    } else {
      throw new Unauthorized(401, "The email or password is incorrect.");
    }
  },

  /**
   * Generates a JSON web token to send to client
   * Uses the following parameters as payload:
   *
   * @param {String} email an existing CSUSM student email
   * @param {String} username an existing username
   * @param {String} userID the ID associated with the account
   *
   * @returns {String} with the JSON web token
   * @throws {GeneralError} if token generation happened to fail
   */
  generateJWT(email, username, userID) {
    try {
      return jwt.sign({ email, username, userID }, process.env.JWT_SECRET, {
        expiresIn: "10hr",
      });
    } catch (err) {
      throw new GeneralError(500, "Server error when authorizing.");
    }
  },

  /**
   * Used in protected routes to verify access to that route
   *
   * @param {String} token the token extracted from the authorization header
   *
   * @returns {Object} with payload that contains user info
   */
  verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Unauthorized(401, "Authorization failed.");
    }
  },
};
