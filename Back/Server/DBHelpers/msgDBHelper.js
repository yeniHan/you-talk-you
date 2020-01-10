var mySqlConnection
var waterfall = require('async-waterfall')

module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection
    return {
        getMsgsInDB: getMsgsInDB,
        sendMsgInDB: sendMsgInDB,
        setReadInDB: setReadInDB
    }
}


function getMsgsInDB (accessToken, callback){

    var query = `SELECT msgs.ID, \`from\`, \`to\`, fromName, content, \`read\`, type, lessonID, \`ts\`, photo from msgs LEFT JOIN accesstokens ON msgs.to = accesstokens.user_id LEFT JOIN users ON msgs.from = users.ID WHERE accesstokens.access_token = '${accessToken}' ORDER BY ID DESC;`
    mySqlConnection.query(query, function (dataObj){
        callback(dataObj.error, dataObj.results)
                                
        
    })
}


function setReadInDB (accessToken, msgID, type, lessonID, finalCallback){
    
    waterfall([
        function(callback){
            //*Msg type:
            //-Confirm request : 1
            //-Confirm : 2
            //-Others: 0 
            //==> Only in the case of confirm request, update the lessons table and store the confirm msg for the request 
            var query1 = `UPDATE msgs SET \`read\` = 1 WHERE ID = ${msgID};`
            mySqlConnection.query(query1, function (dataObj){
                if(dataObj.error){
                     callback(dataObj.error, null)
                }
                callback(null)
            })
        }
        ,function(callback){

            if(type === 1){
                waterfall([
                    function(cb){
                        var query2 = `UPDATE lessons SET confirm = 1 WHERE ID = ${lessonID};`
                        mySqlConnection.query(query2, function (dataObj){
                            if (dataObj.error)  {
                                cb(dataObj.error, null)
                            }
                            cb(null)       
                        })
                    }, function (cb) {
                        var query3 = `SELECT lessons.teacherID, startTS, endTS, courseID, studentID, coursename, username from lessons LEFT JOIN users ON users.ID = lessons.teacherID LEFT JOIN courses ON lessons.courseID = courses.ID WHERE lessons.ID = ${lessonID};`
                        mySqlConnection.query(query3, function (dataObj){
                            if (dataObj.error) {
                                cb(dataObj.error, null)
                            }
                            else{
                                var lessonInfo = dataObj.results
                                 cb(null, lessonInfo)
                            }
                        })
                    }, 
                ], function (err, lessonInfo){
                    if(err) callback(err, null)
                    else callback(null, lessonInfo[0])
                })
            }
            else callback(null, null)

        }, function (lessonInfo, callback){
            
            if(lessonInfo) {
                var teacherID = lessonInfo.teacherID
                var teacherName = lessonInfo.username                                
                var studentID = lessonInfo.studentID                                
                var startTS = lessonInfo.startTS
                var endTS = lessonInfo.endTS
                var courseID = lessonInfo.courseID
                var coursename = lessonInfo.coursename
                var now = parseInt(Date.now()/60000)
                

                var content = `${coursename}/${courseID}/${teacherName}/${teacherID}/${startTS}/${endTS}`
                var query4 = `INSERT INTO msgs (content, \`from\`, fromName, \`ts\`, \`to\`, lessonID, type) VALUES ('${content}', ${teacherID}, '${teacherName}', ${now}, ${studentID}, ${lessonID}, 2);`
                mySqlConnection.query(query4, function (dataObj){
                    if(dataObj.error){
                        callback(dataObj.error, null)
                   }
                   else callback(null)
                })
            }
            else callback(null)
        }, function(callback){
            //Becucase this call changed the hasNewMsg value, 
            //override the req.body.hasNewMsg 
            var query5 = `SELECT msgs.ID from msgs LEFT JOIN accesstokens ON msgs.to = accesstokens.user_id WHERE access_token = '${accessToken}' AND \`read\` = 0;`
            mySqlConnection.query(query5, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error, null)
                    
                }else {
                    var hasNewMsg = dataObj.results.length !== 0? 'true_' + Date.now(): 'false_' + Date.now()
                    callback(null, hasNewMsg)
                    
                }
            })
        }
    ], 
    function(err, hasNewMsg){
                        
        
        if(err) finalCallback(err, null)
        finalCallback(null, hasNewMsg)
    })
}


function sendMsgInDB (content, to, accessToken, finalCallback) {

    waterfall([
        function(callback){
            var query1 = `SELECT username, users.ID AS fromID from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}';`
            mySqlConnection.query(query1, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error, null, null)
                    
                }
                var fromName = dataObj.results[0].username
                var fromID = dataObj.results[0].fromID
                callback(null, fromName, fromID)
            })
        }, function (fromName, fromID, callback){
            var now = parseInt(Date.now()/60000)
            var query2 = `INSERT INTO msgs (\`ts\`, \`from\`, \`to\`, content, fromName, type) VALUES (${now}, ${fromID}, ${to}, '${content}', '${fromName}', 0);`
            mySqlConnection.query(query2, function(dataObj){
                if(dataObj.error ) callback(dataObj.error)
                callback(null)
            })
        }
    ], 
    function(err){
                        
        
        if(err) finalCallback(err)
        finalCallback(null)
    })
}