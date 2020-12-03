const pool = require("../utils/connection");
const mysql = require("mysql2");
const { DatabaseError } = require("../utils/errors");

module.exports = {
  /**
   * Searches all relevant columns given a query string
   * What a massive query, probably an easier way to do that operation...
   *
   * @param {Number} userID of user making request, to mark schedules as bookmarked
   * @param {Object} params all query params retrieved from the request
   *
   * @returns {Array} of all schedules the search finds (for now LIMIT 10)
   * @throws {DatabaseError} if query fails
   */
  async fullSearchSchedulesDb(userID = 0, params) {
    let values = [userID];

    let query = `
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
      WHERE
    `;
    const generalSearchQuery = `
      (MATCH(searchCourses.instructor) AGAINST(?)
      OR MATCH(searchCourses.courseName) AGAINST (?)
      OR MATCH(scheduleTitle) AGAINST (?)
      OR searchCourses.courseID LIKE CONCAT(?, "%")
      OR users.username LIKE CONCAT(?, "%")
      OR users.email LIKE CONCAT(?, "%")
      OR schedules.semester LIKE CONCAT(?, "%"))
    `;
    const filterQuery = `
      schedules.scheduleID IN (SELECT schedules.scheduleID
      FROM schedules
      JOIN schedule_has_courses ON schedules.scheduleID = schedule_has_courses.scheduleID
      WHERE 1 + 1
    `;
    const groupQuery = `
      GROUP BY schedules.scheduleID
      ORDER BY schedules.datePosted DESC
      LIMIT 10
    `;

    // adds the correct number of values to insert into generalSearchQuery since they are duplicated (7)
    const addGeneralSearchVals = () => {
      const columnsToSearch = 7;
      for (let i = 0; i < columnsToSearch; i++) {
        values.push(params.q);
      }
    };

    // adds appropriate params that were found in the query string
    const addParams = () => {
      query += filterQuery;
      for (const [key, val] of Object.entries(params)) {
        if (key === "instructor") {
          query += `AND MATCH(instructor) AGAINST(?)`;
          values.push(val);
        } else if (key === "courseID") {
          query += `AND courseID LIKE CONCAT(?, "%") `;
          values.push(val);
        } else if (key === "email") {
          query += `AND email LIKE CONCAT(?, "%") `;
          values.push(val);
        } else if (key === "days") {
          // if val is an array, loop, otherwise treat it as a normal string
          if (Array.isArray(val)) {
            val.forEach((day) => {
              query += `AND ${day} = 1 `;
              values.push(1);
            });
          } else {
            query += `AND ${val} = 1 `;
            values.push(1);
          }
        }
      }
    };

    // when there is only a general search (q)
    if (params.q && Object.keys(params).length === 1) {
      query = query + generalSearchQuery + groupQuery;
      addGeneralSearchVals();
    } else if (params.q && Object.keys(params).length > 1) {
      addParams();
      query += ` ) AND ${generalSearchQuery} ${groupQuery}`;
      addGeneralSearchVals();
    } else {
      addParams();
      query += ` ) ${groupQuery}`;
    }
    try {
      // apparently you always have to use the format function first at least for this query
      // weird issues occured with bookmarks if it's not used, not entirely sure why?
      const [results] = await pool.execute(mysql.format(query, values));
      return results;
    } catch (err) {
      console.log(err);
      throw new DatabaseError(500, "Could not complete search.");
    }
  },
};
