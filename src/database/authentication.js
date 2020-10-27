const pool = require("../database/connection");

module.exports = {
  async register(req, res) {
    const query = `
      INSERT INTO users (email, username, passhash)
      VALUES (?, ?, ?)
    `;
    let vals = [req.body.email, req.body.username, req.body.passhash];
    try {
      await pool.execute(query, vals);
      res.send({
        message: "Registered New User!",
        email: req.body.email,
        username: req.body.username,
        passhash: req.body.passhash,
      });
    } catch (err) {
      res.send({ error: "Error creating user." });
      console.log("Error inserting user: ", err);
    }
  },
  async login(req, res) {
    const query = `SELECT * FROM users`;
    try {
      let [results] = await pool.query(query);
      console.log(results);
      res.send({
        userID: results[0].userID,
        username: results[0].username,
        passhash: results[0].passhash,
        email: results[0].email,
      });
    } catch (err) {
      res.send({ error: "Error getting records." });
      console.log("Error retrieving tables: ", err);
    }
  },
};
