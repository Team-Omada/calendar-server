const bcrypt = require("bcrypt");
const { getUserByEmailDb } = require("../db/User");
const { Forbidden, GeneralError } = require("../utils/errors");

module.exports = {
  /**
   * Finds email account and compares submitted password with hash
   *
   * @param {String} email user entered email to find
   * @param {String} password user entered password to verify
   *
   * @returns if account is found and passwords match otherwise:
   * @throws {Forbidden} when either check fails
   * @throws {GeneralError} if the bcrypt comparison fails
   */
  async checkCredentials(email, password) {
    let accountInfo = await getUserByEmailDb(email);
    if (!accountInfo) {
      throw new Forbidden(403, "The account or password is incorrect.");
    }
    try {
      const match = await bcrypt.compare(password, accountInfo.passhash);
      if (match) {
        return;
      } else {
        throw new Forbidden(403, "The account or password is incorrect.");
      }
    } catch (err) {
      throw new GeneralError(500, "There was an issue logging you in.");
    }
  },
};
