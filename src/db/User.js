const pool = require("../utils/connection");
const { DatabaseError } = require("../utils/errors");
module.exports = {
  async insertUserDb(email, username, passhash) {
    const insertQuery = `
      INSERT INTO users (email, username, passhash)
      VALUES (?, ?, ?)
    `;
    try {
      return await pool.execute(query, [email, username, passhash]);
    } catch (err) {
      throw new DatabaseError(
        500,
        "There was an issue creating your account!",
        err
      );
    }
  },
  async checkUniqueDb(email, username) {
    const query = `
      SELECT * FROM users WHERE (email = ? OR username = ?)
    `;
    try {
      let [results] = await pool.execute(query, [email, username]);
      return results;
    } catch (err) {
      throw new DatabaseError(
        500,
        "There was an issue validating your new account!",
        err
      );
    }
  },
  async getAllUsersDb() {
    const query = `SELECT * FROM users`;
    try {
      let [results] = await pool.query(query);
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
