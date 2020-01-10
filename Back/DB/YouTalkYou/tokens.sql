
create table accessTokens (
    ID int AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL,
    client_id text NOT NULL,
    access_token varchar(300),
    access_token_expires_at timestamp
);


create table refreshTokens (
    ID int AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL,    
    client_id text NOT NULL,
    refresh_token varchar(300),
    refresh_token_expires_at timestamp
);

