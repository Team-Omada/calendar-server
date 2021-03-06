const {
  validateUser,
  hashPassword,
  createUser,
  retrieveUserSchedules,
} = require("../services/UserService");
const {
  checkCredentials,
  generateJWT,
  verifyJWT,
} = require("../services/AuthService");
const { Unauthorized } = require("../utils/errors");

module.exports = {
  // Validates new user credentials, hashes password, creates user, sends JWT with credentials
  async register(req, res, next) {
    const { email = "", username = "", password = "" } = req.body;
    try {
      await validateUser(email, username, password);
      const passhash = await hashPassword(password);
      const userID = await createUser(email, username, passhash);
      const token = generateJWT(email, username, userID);
      res.send({
        user: {
          email,
          username,
          userID,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  // Checks provided credentials and generates a JWT to send
  async login(req, res, next) {
    const { email = "", password = "" } = req.body;
    try {
      const accountInfo = await checkCredentials(email, password);
      const token = generateJWT(
        accountInfo.email,
        accountInfo.username,
        accountInfo.userID
      );
      res.send({
        user: {
          email,
          username: accountInfo.username,
          userID: accountInfo.userID,
        },
        token,
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
      if (!req.headers.authorization) {
        throw new Unauthorized(401, "Authorization failed.");
      }
      const token = req.headers.authorization.split(" ")[1];
      const payload = verifyJWT(token);
      req.userInfo = payload; // do something with payload?
      next();
    } catch (err) {
      return res.status(err.status).send({
        message: err.message,
        info: err.info,
      });
    }
  },

  // Gets all user schedules given a userID and searches by any query params given
  async getUserSchedules(req, res, next) {
    const { userID } = req.userInfo;
    const { id: requestedID } = req.params;
    const params = { ...req.query, requestedID };
    try {
      const results = await retrieveUserSchedules(userID, params);
      res.send({
        results,
      });
    } catch (err) {
      next(err);
    }
  },
};
