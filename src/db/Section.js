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
    // [[scheduleID, courseID, instructor, days, startTime, endTime],...,]
    const sectionInfo = courses.map((course) => {
      const dayGrid = {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      };
      let rows = [
        scheduleID,
        course.courseID,
        course.courseName,
        course.instructor,
        course.startTime,
        course.endTime,
      ];
      course.days.forEach((day) => {
        dayGrid[day.toLowerCase()] = 1; // set corresponding day to 1
      });
      for (const dayName in dayGrid) {
        rows.push(dayGrid[dayName]); // push entire grid as values for INSERT
      }
      return rows;
    });

    const query = mysql.format(
      `
        INSERT INTO schedule_has_courses 
        (scheduleID, courseID, courseName, instructor, startTime, endTime, 
          monday, tuesday, wednesday, thursday, friday, saturday, sunday)
        VALUES ?
      `,
      [sectionInfo]
    );
    await transactionConn.execute(query);
    // error handled in caller with transactionConn
  },

  async deleteSectionsOnScheduleDb(transactionConn, scheduleID) {
    await transactionConn.execute(
      `DELETE FROM schedule_has_courses WHERE scheduleID = ?`,
      [scheduleID]
    );
  },
};
