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
    const query = `
      INSERT INTO users (email, username, passhash)
      VALUES (?, ?, ?)
    `;
    try {
      const [results] = await pool.execute(query, [email, username, passhash]);
      return results.insertId;
    } catch (err) {
      throw new DatabaseError(500, "There was an issue creating your account!");
    }
  },

  /**
   * Gets all possible records that may have the same email or username
   *
   * @param {String} email a validated CSUSM student email
   * @param {String} username a validated username
   *
   * @returns {Object} of the first account found with same username or email, null otherwise
   * @throws {DatabaseError} the query wasn't executed, validation will then fail
   */
  async checkUniqueUserDb(email, username) {
    const query = `
      SELECT * FROM users WHERE (email = ? OR username = ?) LIMIT 1
    `;
    try {
      const [results] = await pool.execute(query, [email, username]);
      return results.length == 0 ? null : results[0];
    } catch (err) {
      throw new DatabaseError(
        500,
        "There was an issue creating your new account!"
      );
    }
  },

  /**
   * Finds the account associated with a specific email
   *
   * @param {String} email user entered email to search for
   *
   * @returns {Object} of all info on matching email
   * @throws {DatabaseError} something went wrong when retrieving account info.
   */
  async getUserByEmailDb(email) {
    const query = `SELECT * FROM users WHERE (email = ?)`;
    try {
      const [results] = await pool.execute(query, [email]);
      return results.length == 0 ? null : results[0];
    } catch (err) {
      throw new DatabaseError(500, "There was an issue logging you in.");
    }
  },
};
