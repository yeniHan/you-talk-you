create table lessons (
    ID int NOT NULL,
    startTime datetime NOT NULL,
    endTime datetime NOT NULL,
    courseID int NOT NULL,
    studentID int NOT NULL,
    PRIMARY KEY(ID)
);