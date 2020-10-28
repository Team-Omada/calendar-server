// Middleware for server side validation
// Note that there is client side validation
// But it is always good to have both.
const pool = require("../database/connection");

module.exports = {
  async register(req, res, next) {
    const emailPattern = /^[A-Za-z]{2,5}[\d]{3}@cougars\.csusm\.edu$|^[A-Za-z]{2,}@csusm\.edu$/;
    const userPattern = /^[\w]{3,20}$/;
    const passPattern = /^.{8,}$/;
    const checkEmailExists = `
      SELECT * FROM users WHERE (email = ? OR username = ?)
    `;

    // if the regex pattern is not matched, send 400 error (Bad Request)
    if (!emailPattern.test(req.body.email)) {
      res.status(400).send({
        emailError: "Must be a CSUSM student email.",
      });
    } else if (!userPattern.test(req.body.username)) {
      res.status(400).send({
        nameError: "Must contain only letters, digits, or underscore.",
      });
    } else if (!passPattern.test(req.body.password)) {
      res.status(400).send({
        passError: "Password must be greater than 8 characters.",
      });
    } else {
      // check if the email or username is already in use
      try {
        let [results] = await pool.execute(checkEmailExists, [
          req.body.email,
          req.body.username,
        ]);
        if (results.length > 0) {
          if (results[0].email === req.body.email) {
            return res.status(400).send({
              emailError: "That email is already being used.",
            });
          } else if (results[0].username === req.body.username) {
            return res.status(400).send({
              nameError: "That username is already being used",
            });
          }
        }
      } catch (err) {
        console.log("Error in unique register check: ", err);
        return res.status(500).send({ error: "A server error has occurred." });
      }
      next();
    }
  },
};
