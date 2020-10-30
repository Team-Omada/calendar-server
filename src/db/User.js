const pool = require("../utils/connection");
const { DatabaseError } = require("../utils/errors");
module.exports = {
  /**
   * Inserts new user with hashed password into our RDS instance
   *
   * @param {String} email validated CSUSM student email
   * @param {String} username validated unique username
   * @param {String} passhash validated, hashed password
   *
   * @returns {Number} the userID (auto-incremented val) that was inserted
   * @throws {DatabaseError} the account was not created
   */
  async insertUserDb(email, username, passhash) {
    const insertQuery = `
      INSERT INTO users (email, username, passhash)
      VALUES (?, ?, ?)
    `;
    try {
      const [results] = await pool.execute(insertQuery, [
        email,
        username,
        passhash,
      ]);
      return results.insertId;
    } catch (err) {
      throw new DatabaseError(
        500,
        "There was an issue creating your account!",
        err
      );
    }
  },

  /**
   * Gets all possible records that may have the same email or username
   *
   * @param {String} email a validated CSUSM student email
   * @param {String} username a validated username
   *
   * @returns {Array} of all possible rows as objects
   * @throws {DatabaseError} the query wasn't executed, validation will then fail
   */
  async checkUniqueDb(email, username) {
    const query = `
      SELECT * FROM users WHERE (email = ? OR username = ?)
    `;
    try {
      const [results] = await pool.execute(query, [email, username]);
      return results;
    } catch (err) {
      throw new DatabaseError(
        500,
        "There was an issue creating your new account!",
        err
      );
    }
  },
  async getAllUsersDb() {
    const query = `SELECT * FROM users`;
    try {
      const [results] = await pool.query(query);
      return results;
    } catch (err) {
      throw new DatabaseError(
        500,
        "Something went wrong when fetching users.",
        err
      );
    }
  },
};
