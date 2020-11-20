const { fullSearchSchedulesDb } = require("../db/Search");

module.exports = {
  /**
   * Does basic search if only q param is present
   * Does basic search plus filtering if other params are present
   *
   * @param {Number} userID of user making request, to mark schedules as bookmarked
   * @param {Object} query containing all query parameters
   *
   * @returns {Array} of all schedules that were found in the search
   */
  async searchAllSchedules(userID = 0, query) {
    // if query has just a full text search (q)
    if (query.q && Object.keys(query).length === 1) {
      return await fullSearchSchedulesDb(userID, query.q);
    }
  },
};
