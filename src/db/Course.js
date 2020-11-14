const mysql = require("mysql2");

module.exports = {
  /**
   * Assumes courses will only ever be added when a schedule is added
   * Ignores any duplicate values and inserts courses that are not yet present
   *
   * @param {Object} transactionConn the connection grabbed from the pool
   * @param {Array} courses contains all info on the courses for this schedule
   */
  async insertCoursesDb(transactionConn, courses) {
    // [[courseID],...,]
    const courseInfo = courses.map((course) => {
      return [course.courseID];
    });
    // must format before using execute function
    const query = mysql.format(
      `INSERT IGNORE INTO courses (courseID) VALUES ?`,
      [courseInfo]
    );
    await transactionConn.execute(query);
    // error handled in caller with transactionConn
  },
};
