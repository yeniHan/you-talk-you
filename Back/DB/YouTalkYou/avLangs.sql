create table avLangs (
    ID int NOT NULL AUTO_INCREMENT, 
    userID int NOT NULL,
    KR tinyint, 
    EN tinyint, 
    CN tinyint, 
    FR tinyint, 
    DE tinyint, 
    PRIMARY KEY(ID)   
);

levels: 0~ 5
ex) KR 5 : Native levels
ex) EN  0:  Not at all
ex) EN 1: Little bit