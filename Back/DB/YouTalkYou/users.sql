create database youTalkYou; 


create table users (
    ID int NOT NULL AUTO_INCREMENT, 
    user_type varchar(10) NOT NULL,
    username varchar(20) NOT NULL,
    pw varchar(30) NOT NULL,
    email varchar(200) NOT NULL,
    courses text,
    gender tinyint,
    nationality varchar(5),
    teachingLangs varchar(200),
    introduction mediumtext,
    professional tinyint(1),
    experience tinyint(1),
    tags varchar(256),
    photo text,
    PRIMARY KEY(ID)   
);

ALTER TABLE users ADD professional boolean;
*user_type :  
-student: 0     -teacher: 1
-- Student type user
*courses; 'xxxx/xxxx/xxxx'=> course IDs 
    up to 10 the most recent courses!
*pw; 
    conditions:
    up to 30 characters! Should include more than 1 special character and more than one digit. 
-- Teacher type user
*nationality: "KR" "EN" "PR" etc..
*availableLangs: (lang) + (level) 
  -level: 1/2/3/4/5
  -Up to 10 langs 
 "EN4/KR1/PR5"
*gender
-male: 0      -female: 1
*experience:
 0 years= 0/ ~1y = 1/ 1y ~3 = 2/ 3y ~5y = 3/ 5~ = 4
*tags
"xxx/xxx/xxx"
==> cant include any special character.



-- create table students (
--     ID int NOT NULL AUTO_INCREMENT, 
--     username varchar(20) NOT NULL,
--     pw varchar(30) NOT NULL,
--     email varchar(200) NOT NULL,
--     courses text,
--     PRIMARY KEY(ID)       
-- );
-- *courses; 'xxxx/xxxx/xxxx'=> course IDs 
--     up to 10 the most recent courses!
-- *pw; 
--     conditions:
--     up to 30 characters! Should include more than 1 special character and more than one digit. 

-- create table teachers (
--     ID int NOT NULL AUTO_INCREMENT, 
--     username varchar(20) NOT NULL,
--     pw varchar(30) NOT NULL,
--     email varchar(200) NOT NULL,
--     gender tinyint NOT NULL,
--     introduction mediumtext DEFAULT '',
--     experience tinyint NOT NULL,
--     tags varchar(256),
--     PRIMARY KEY(ID)   
);



