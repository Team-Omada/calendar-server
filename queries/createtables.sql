CREATE TABLE `users` (
  `userID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `passhash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`userID`),
  CONSTRAINT `unique_username` UNIQUE (`username`),
  CONSTRAINT `unique_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `schedules` (
  `scheduleID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `datePosted` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `scheduleTitle` VARCHAR(255) NOT NULL,
  `semester` ENUM('Spring', 'Fall', 'Summer', 'Winter') NOT NULL,
  `semesterYear` YEAR NOT NULL,
  `userID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`scheduleID`),
  KEY `userAttached_idx` (`userID`),
  CONSTRAINT `FK_schedules_users_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `courses` (
  `courseID` VARCHAR(45) NOT NULL,
  `courseName` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `comments` (
  `commentID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` TEXT NOT NULL,
  `datePosted` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userID` INT UNSIGNED NOT NULL,
  `scheduleID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`commentID`),
  KEY `postingUser_idx` (`userID`),
  KEY `onSchedule_idx` (`scheduleID`),
  CONSTRAINT `FK_comments_schedules_scheduleID` FOREIGN KEY (`scheduleID`) REFERENCES `schedules` (`scheduleID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comments_user_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `schedule_has_courses` (
  `courseID` VARCHAR(45) NOT NULL,
  `scheduleID` INT UNSIGNED NOT NULL,
  `instructor` VARCHAR(45) NOT NULL,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `monday` tinyint(1) NOT NULL,
  `tuesday` tinyint(1) NOT NULL,
  `wednesday` tinyint(1) NOT NULL,
  `thursday` tinyint(1) NOT NULL,
  `friday` tinyint(1) NOT NULL,
  `saturday` tinyint(1) NOT NULL,
  `sunday` tinyint(1) NOT NULL;
  PRIMARY KEY (`courseID`,`scheduleID`),
  CONSTRAINT `FK_has_courses_courseID` FOREIGN KEY (`courseID`) REFERENCES `courses` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_has_schedules_scheduleID` FOREIGN KEY (`scheduleID`) REFERENCES `schedules` (`scheduleID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `users_bookmark_schedules` (
  `userID` INT UNSIGNED NOT NULL,
  `scheduleID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`userID`, `scheduleID`),
  CONSTRAINT `FK_users_bookmark_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_schedules_bookmark_scheduleID` FOREIGN KEY (`scheduleID`) REFERENCES `schedules` (`scheduleID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;