const { fullSearchSchedulesDb } = require("../db/Search");

module.exports = {
  /**
   * Does basic search if only q param is present
   * Does basic search plus filtering if other params are present
   *
   * @param {Number} userID of user making request, to mark schedules as bookmarked
   * @param {Object} params containing all query parameters
   *
   * @returns {Array} of all schedules that were found in the search
   */
  async searchAllSchedules(userID = 0, params) {
    return await fullSearchSchedulesDb(userID, params);
  },
};
