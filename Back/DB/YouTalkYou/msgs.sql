create table msgs (
    ID int AUTO_INCREMENT NOT NULL,
    `datetime` datetime NOt NULL, 
    `from` int NOT NULL,
    `to` int NOT NULL,
    content text NOT NULL,   
    PRIMARY KEY(ID)
);