const mysql = require("mysql2");

module.exports = {
  /**
   * Assumes sections will only ever be added when schedule is added
   *
   * @param {Object} transactionConn the connection grabbed from the pool
   * @param {Array} courses contains all info on the courses for this schedule
   * @param {Number} scheduleID the associated scheduleID that holds these sections
   */
  async insertSectionsDb(transactionConn, courses, scheduleID) {
    // [[courseID, instructor, days, startTime, endTime],...,]
    const sectionInfo = courses.map((course) => {
      return [
        scheduleID,
        course.courseID,
        course.instructor,
        course.days,
        course.startTime,
        course.endTime,
      ];
    });
    const query = mysql.format(
      `
        INSERT INTO schedule_has_courses 
        (scheduleID, courseID, instructor, days, startTime, endTime)
        VALUES ?
      `,
      [sectionInfo]
    );
    await transactionConn.execute(query);
    // error handled in caller with transactionConn
  },
};
