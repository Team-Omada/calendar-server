const {
  validateUser,
  hashPassword,
  createUser,
} = require("../services/UserService");
const { checkCredentials } = require("../services/AuthService");

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
    const { email, password } = req.body;
    try {
      await checkCredentials(email, password);
      res.send({
        message: "Login was successful!",
        email,
      });
    } catch (err) {
      next(err);
    }
  },
};
