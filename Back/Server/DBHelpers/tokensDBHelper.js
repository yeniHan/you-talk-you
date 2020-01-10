var mySqlConnection

module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection

    return {
        saveTokensInDB: saveTokensInDB,
        getUserInDB: getUserInDB,
        getRefreshTokenInDB: getRefreshTokenInDB,
        revokeRefreshTokenInDB: revokeRefreshTokenInDB,
        getAccessTokenInDB: getAccessTokenInDB,
        saveAccessTokenInDB: saveAccessTokenInDB,
        saveRefreshTokenInDB: saveRefreshTokenInDB
    }

}

// user_id int NOT NULL,
// access_token varchar(300),
// access_token_expires_at timestamp,
// refresh_token varchar(300),
// refresh_token_expires_at timestamp

//Expires 
//-access_token: 1 h
//-refresh_token: 24 h 

function getUserInDB ( username, password, callback) {
    var query = `SELECT ID FROM users WHERE username = '${username}' AND pw = '${password}';`

    mySqlConnection.query(query, function (dataObj) {

        if(dataObj.error){
            
            
            callback(dataObj.err, null)
            
        }
        else{
            
            
            var userId = dataObj.results.length === 0? null : dataObj.results[0].ID
            callback( null, userId == null ? null: { id: userId })
            
        }
    })
}

function saveTokensInDB (token, user ){

    if(token.refresh_token)
    console.log('token:', token);
    

    var query = `INSERT INTO tokens (access_token, access_token_expires_at, refresh_token, refresh_token_expires_at ) VALUES ('${token.accessToken}', ${token.accessTokenExpiresAt}, '${token.refreshToken}', ${token.refreshTokenExpiresAt}) WHERE user_id = ${user.id};`
    mySqlConnection.query(query, function (dataObj) {
        return dataObj.error
    })

}


function getAccessTokenInDB (accessToken, callback){
    console.log('getAccessTokenInDB()')
    var query1 = `SELECT * from accesstokens WHERE access_token = '${accessToken}';`

    mySqlConnection.query(query1, function (dataObj){
        if(dataObj.error ) {
                        
            
            callback(dataObj.error, null)

        }else {
            if(dataObj.results.length === 0) {
                
                
                callback(true, null)
                
            }else {
                var token = dataObj.results[0]
                
                
                callback(null, {
                accessToken: token.access_token,
                clientId: 'client',
                expires:  token.access_token_expires_at,
                userId: token.user_id
              })
              
            }
        }
    })

}

function getRefreshTokenInDB(refreshToken, callback){
    var query = `SELECT * from refreshtokens WHERE refresh_token = '${refreshToken}';`

    mySqlConnection.query(query, function (dataObj){
        
        console.log('results###########33:', dataObj.results);
        
        if(dataObj.results != null){
            var token = dataObj.results[0]
            
            callback(null, {
                refreshToken: token.refresh_token,
                expires: token.refresh_token_expires_at,
                user: {id: token.user_id},
                userId: token.user_id,
                clientId: 'client'
            })
            
        }else{
            
            
            callback(dataObj.err, null)
            
        }
    })

}

function revokeRefreshTokenInDB(token, callback){
    console.log('evokeRefreshTokenInDB(), token:', token)
    var query = `DELETE FROM refreshtokens WHERE refresh_token = '${token.refreshToken}';`
    mySqlConnection.query(query, function(dataObj){
        if(dataObj.error) {
            
            
            callback(dataObj.error)
            
        }
        else{ 
            
            
            callback(null)
            
        }
    })

}



function saveAccessTokenInDB (accessToken, clientID, expires, user, callback){
    // let expiresTS = Date.now() + 3*60*60*1000
    console.log('saveAccessTokenInDB():','accesstoken:', accessToken,'clientID:' ,clientID, 'expires:', expires, 'user:', user, 'callback:', callback)
    var query1 = `SELECT * from accesstokens WHERE user_id = '${user.id}';`
    var query2 = `INSERT INTO accesstokens (access_token, access_token_expires_at, client_id, user_id) VALUES ('${accessToken}', ${expires}, '${clientID}', ${user.id})`
    var query3 = `UPDATE accesstokens SET access_token = '${accessToken}', access_token_expires_at = ${expires} WHERE user_id = ${user.id};`

    mySqlConnection.query(query1, function(dataObj){
        if(dataObj.error) {
            
            
            callback(dataObj.error)
            
        }else if(dataObj.results.length === 1 || dataObj.results.length === 0){
            let results = dataObj.results
            if(results.length === 0) {
                mySqlConnection.query(query2, function (dataObj){
                    if(dataObj.error) {
                        
                        
                        callback(dataObj.error)
                        
                    }
                    else {
                        
                        
                        callback(null)
                    }
                })
            }else{
                mySqlConnection.query(query3, function (dataObj){
                    if(dataObj.error) {
                        
                        
                        callback(dataObj.error)
                        
                    } else{
                        
                        
                         callback(null)
                    }                         
                })
            }
        }else{
                        
            
            callback('Invalid access token')
        }
    })
}



function saveRefreshTokenInDB (refreshToken, clientID, expires, user, callback){
    console.log('user:', user)
    console.log('saveRefreshTokenInDB():','refreshToken:', refreshToken,'clientID:' ,clientID, 'expires:', expires, 'user:', user, 'callback:', callback)
    var query1 = `SELECT * FROM refreshtokens WHERE user_id = ${user.id};`
    var query2 = `INSERT INTO refreshtokens (refresh_token, client_id, refresh_token_expires_at, user_id) VALUES ('${refreshToken}', '${clientID}', ${expires}, ${user.id});`
    var query3 = `UPDATE refreshtokens SET refresh_token = '${refreshToken}', refresh_token_expires_at = ${expires}  WHERE user_id = ${user.id};`
    

    mySqlConnection.query(query1, function(dataObj){
        if(dataObj.error) {
                        
            
            callback(dataObj.error)}
        else {
            if(dataObj.results.length === 0){
                mySqlConnection.query(query2, function(dataObj){
                                
                    
                    callback(dataObj.error)
                })  
            }else{
                mySqlConnection.query(query3, function(dataObj){
                                

                    callback(dataObj.error)
                })  
            }
       
        }
    })
}





function getUserIDFromBearerToken(bearerToken, callback){
    console.log('getUserIDFromBearerToken(), bearToken:', bearerToken)
  const query = `SELECT * FROM tokens WHERE access_token = '${bearerToken}';`

  //execute the query to get the userID
  mySqlConnection.query(query, function (dataObj) {

      //get the userID from the results if its available else assign null
      const userID = dataObj.results != null && dataObj.results.length == 1 ?
                                                              dataObj.results[0].user_id : null
                    
    
        callback(userID)
  })
}


