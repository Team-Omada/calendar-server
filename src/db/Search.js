const pool = require("../utils/connection");
const { DatabaseError } = require("../utils/errors");

module.exports = {
  /**
   * Searches all relevant columns given a search string
   * What a massive query, probably an easier way to do that operation...
   *
   * @param {Number} userID of user making request, to mark schedules as bookmarked
   * @param {String} search the q parameter of query indicating a basic search with no filtering
   *
   * @returns {Array} of all schedules the search finds (for now LIMIT 10)
   * @throws {DatabaseError} if query fails
   */
  async fullSearchSchedulesDb(userID = 0, search) {
    const columnsToSearch = 6;
    let columns = [userID];
    for (let i = 0; i < columnsToSearch; i++) {
      columns.push(search);
    }
    const query = `
      SELECT users.userID, users.username, users.email, schedules.scheduleID, 
        datePosted, scheduleTitle, semester, semesterYear, 
        GROUP_CONCAT(DISTINCT allCourses.courseID SEPARATOR ', ') as courses,
        IF(users_bookmark_schedules.scheduleID IS NULL, false, true) as bookmarked
      FROM users
      JOIN schedules ON schedules.userID = users.userID
      JOIN schedule_has_courses AS allCourses ON schedules.scheduleID = allCourses.scheduleID
      JOIN schedule_has_courses AS searchCourses ON schedules.scheduleID = searchCourses.scheduleID
      LEFT JOIN users_bookmark_schedules ON users_bookmark_schedules.userID = ?
        AND users_bookmark_schedules.scheduleID = schedules.scheduleID
      WHERE MATCH(searchCourses.instructor) AGAINST(?)
        OR MATCH(searchCourses.courseName) AGAINST (?)
        OR MATCH(scheduleTitle) AGAINST (?)
        OR searchCourses.courseID LIKE CONCAT(?, "%")
        OR users.username LIKE CONCAT(?, "%")
        OR users.email LIKE CONCAT(?, "%")
        OR schedules.semester LIKE CONCAT(?, "%")
      GROUP BY schedules.scheduleID
      ORDER BY schedules.datePosted DESC
      LIMIT 10;
    `;
    try {
      const [results] = await pool.execute(query, columns);
      return results;
    } catch (err) {
      throw new DatabaseError(500, "Could not complete search.");
    }
  },
};
