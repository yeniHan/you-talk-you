create database youTalkYou; 


//for lectures 
create table lectures (
    ID int NOT NULL AUTO_INCREMENT,
    teacherID int NOT NULL,
    studentID int NOT NULL,
    `dateTime` datetime NOT NULL, 
    `hours` tinyint NOT NULL,
    `status` tinyint NOT NULL,
    PRIMARY KEY(ID)            
);

*status; how the lecture was proceeded
- planned: 0
- canceled: -1
- done: 1


//for the courses which teachers provide
create table courses (
    ID int NOT NULL AUTO_INCREMENT,
    teacherID int NOT NULL,
    coursename varchar(20) NOT NULL,
    lang varchar(5) NOT NULL,
    introduction TEXT,
    price varchar(300) NOT NULL,
    videoURL TEXT, 
    unitTime varchar(20) NOT NULL,
    `period` varchar(50) NOT NULL,
    students int DEFAULT 0,
    PRIMARY KEY(ID)            
);
*coursename; =< 20 characters
*lang: 2 letters ex) "KR","EN"
*unitTime: time for one class ===> "price" will be decided by the unitTime
    ex) '1H' '60M' 
*period: expected period to finish the course
    ex) '1Y' '6M'
*price: value + country code of the currency
    ex) '10/US' => 10 dollar
    ex) '20000/KR' => 20000 won
*students: The number of the students who selected the course


//Review for teachers
create table reviews_teachers (
    ID int NOT NULL AUTO_INCREMENT,
    teacherID int NOT NULL,
    writer int NOT NULL,
    score decimal(2, 1) DEFAULT 0.0,    
    review text NOT NULL,
    PRIMARY KEY(ID)                
);
*rating 0.0 ~ 5.0


//Review for courses
create table reviews_courses (
    ID int NOT NULL AUTO_INCREMENT,
    writer int NOT NULL,
    score decimal(2, 1) DEFAULT 0.0,    
    review text NOT NULL,
    courseID int NOT NULL,
    PRIMARY KEY(ID)  
);




create table messages (
    ID int NOT NULL AUTO_INCREMENT,
    `dateTime` timestamp DEFAULT now(),
    senderID int NOT NULL,
    receiverID int NOT NULL,
    content text NOT NULL,
    status tinyint DEFAULT 0,
    PRIMARY KEY(ID)  
);

*status
- unread: 0
- read: 1