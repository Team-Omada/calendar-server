module.exports = {
  /**
   * Assumes courses will only ever be added when a schedule is added
   * Ignores any duplicate values and inserts courses that are not yet present
   *
   * @param {Object} transactionConn the connection grabbed from the pool
   * @param {Array} courseInfo [[courseID, courseName],...,]
   */
  async insertCoursesDb(transactionConn, courseInfo) {
    const query = `INSERT IGNORE INTO courses VALUES ?`;
    await transactionConn.execute(query, [courseInfo]);
    // error handled in caller with transactionConn
  },
};
