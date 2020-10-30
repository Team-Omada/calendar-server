const { getAllUsersDb } = require("../db/User");
const { GeneralError } = require("../utils/errors");

module.exports = {
  async fakeAuth() {
    let results = await getAllUsersDb();
    if (results.length === 0) {
      throw new GeneralError(200, "There are no users!");
    }
    return [results];
  },
};
