const {
  validateUser,
  hashPassword,
  createUser,
} = require("../services/UserService");
const {
  checkCredentials,
  generateJWT,
  verifyJWT,
} = require("../services/AuthService");

module.exports = {
  // Validates new user credentials, hashes password, and creates the user
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

  // Checks provided credentials and generates a JWT to send
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const accountInfo = await checkCredentials(email, password);
      const token = generateJWT(
        accountInfo.email,
        accountInfo.username,
        accountInfo.userID
      );
      res.send({
        message: "Login was successful!",
        username: accountInfo.username,
        token,
        email,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Add this function before intended controller to check authentication
   * No custom error middleware used to avoid extracting auth header at every route we needed
   * Plus, it makes a bit more sense to include this within the route definition.
   */
  checkAuthenticated(req, res, next) {
    try {
      // assumes client will be sending "Bearer ${token}" in header
      // if there is no token, [1] will be an empty string
      const token = req.headers.authorization.split(" ")[1];
      const payload = verifyJWT(token);
      req.userInfo = payload;
      next();
    } catch (err) {
      return res.status(err.status).send({
        message: err.message,
        info: err.info,
      });
    }
  },
};
