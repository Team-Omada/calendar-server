module.exports = {
  /**
   * Used after querying from DB for courses to remove all day columns
   * Instead of {...info, monday: 0, tuesday: 1,...} we send days: [monday, tuesday]
   *
   * @param {Array} courses an array of courses
   *
   * @returns {Array} formatted array of courses for more usable response
   */
  formatCourses(courses) {
    const dayPattern = /^(mon|tues|wednes|thurs|fri|satur|sun){1}(day){1}$/;
    const formattedInfo = courses.map((course) => {
      const days = [];
      for (const val in course) {
        if (dayPattern.test(val) && course[val] === 1) {
          days.push(val);
        }
      }
      return {
        courseID: course.courseID,
        instructor: course.instructor,
        courseName: course.courseName,
        startTime: course.startTime,
        endTime: course.endTime,
        days,
      };
    });
    return formattedInfo;
  },
};
