var mySqlConnection;
module.exports = function(injectedSqlConnection){
    mySqlConnection  = injectedSqlConnection
    return {
        checkNewMsg: checkNewMsg
    }
}

function checkNewMsg(req, res, next){
    var accessToken = req.headers.authorization.split(' ')[1]
    var userID;
    var query1 = `SELECT userID from accesstokens  WHERE access_token = '${accessToken};'`
    mySqlConnection.query(query1, function(dataObj){
        if(dataObj.error){ 
            req.body.hasNewMsg = false
            next()
        }
        else{
            var query2 = `SELECT COUNT(*) AS newMsgs from lessons WHERE confirm = 0;`
            mySqlConnection.query(query2, function(dataObj){
                if(dataObj.error) {
                    req.body.hasNewMsg = false
                    next()
                }
                else{
                    req.body.hasNewMsg = dataObj.results[0].newMsgs === 0? false: true
                    next()
                }
            })
        }
    })
    
}