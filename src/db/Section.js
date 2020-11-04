module.exports = {
  /**
   * Assumes sections will only ever be added when schedule is added
   *
   * @param {Object} transactionConn the connection grabbed from the pool
   * @param {Array} sectionInfo [[courseID, instructor, days, startTime, endTime],...,]
   */
  async insertSectionsDb(transactionConn, sectionInfo) {
    const query = `
      INSERT INTO schedule_has_courses 
      (courseID, scheduleID, instructor, days, startTime, endTime)
      VALUES ?
    `;
    await transactionConn.execute(query, [sectionInfo]);
    // error handled in caller with transactionConn
  },
};
