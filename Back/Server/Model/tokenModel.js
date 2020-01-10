let userDBHelper
let tokensDBHelper

module.exports =  (injectedUserDBHelper, injectedTokensDBHelper) => {

    userDBHelper = injectedUserDBHelper
    tokensDBHelper = injectedTokensDBHelper

    return  {
        getClient: getClient,
        getUser: getUser,
        saveAccessToken: saveAccessToken,
        saveRefreshToken: saveRefreshToken,
        saveToken: saveToken,
        grantTypeAllowed: grantTypeAllowed,
        getRefreshToken: getRefreshToken,
        getAccessToken: getAccessToken,
        revokeRefreshToken: revokeRefreshToken
    }
}


function getClient(clientID, clientSecret, callback){
    console.log('getClient()', 'clientID:', clientID, 'clientSecret:', clientSecret, 'callback:', callback)

    const client = {
        clientID,
        clientSecret,
        grants: null,
        redirectUris: null
    }
    
    callback(false, client)

}

function grantTypeAllowed (clientID, grantType, callback){
    console.log('grantTypeAllowed()')
    
    callback(false, true)
}


function getUser(username, password, callback){
    console.log('getUser()', 'username:', username, 'password:', password, 'callback:', callback)
    

    tokensDBHelper.getUserInDB(username, password, callback)
}

function getAccessToken(accessToken, callback){
    console.log('getAccessToken()', 'accessToken:', accessToken)
    
    tokensDBHelper.getAccessTokenInDB(accessToken, callback)
}

function getRefreshToken(refreshToken, callback){
    console.log('getRefreshToken()' , 'refreshToken:', refreshToken)
    
    tokensDBHelper.getRefreshTokenInDB(refreshToken, callback)
}


function saveToken(token, client, user){

    console.log('saveToken()', 'token:', token, 'client:', client, 'user:', user )
    if(tokensDBHelper.saveTokenInDB(token, user.id) == null) {
        var newToken = token
        newToken.client = client
        newToken.client.id = client.clientId
        newToken.user = user

        return newToken
    }
}



function revokeRefreshToken (refreshToken, callback) {
    tokensDBHelper.revokeRefreshTokenInDB(refreshToken, callback)
}


function saveAccessToken(accessToken, clientID, expires, user, callback){
    console.log('saveAcessToken()', 'accessToken:',accessToken, 'clientID:', clientID, 'expires:', expires,'user:' ,user, 'callback:',callback)
    
    tokensDBHelper.saveAccessTokenInDB(accessToken, clientID, expires ,user, callback)
}

function saveRefreshToken (refreshToken, clientID, expires, user, callback){
    console.log('saveRefreshToken()', 'refreshToken:', refreshToken, 'clientID:', clientID, 'expires:', expires, 'user:', user ,'callback:' , callback)

    tokensDBHelper.saveRefreshTokenInDB(refreshToken, clientID, expires, user, callback)
}
