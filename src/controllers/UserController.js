const {
  validateUser,
  hashPassword,
  createUser,
} = require("../services/UserService");
const { fakeAuth } = require("../services/AuthService");

module.exports = {
  async register(req, res, next) {
    const { email, username, password } = req.body;
    try {
      await validateUser(email, username, password);
      const passhash = await hashPassword(password);
      await createUser(email, username, passhash);
      res.send({
        message: "Registered New User!",
        passhash,
        email,
        username,
      });
    } catch (err) {
      next(err);
    }
  },
  async login(req, res, next) {
    try {
      let results = await fakeAuth();
      res.send({
        userID: results[0].userID,
        username: results[0].username,
        passhash: results[0].passhash,
        email: results[0].email,
      });
    } catch (err) {
      next(err);
    }
  },
};
