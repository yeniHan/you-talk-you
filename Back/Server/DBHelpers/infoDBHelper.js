var mySqlConnection
var waterfall = require('async-waterfall')

module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection
    return {
        getTeacherInDB: getTeacherInDB,
        getCourseInDB: getCourseInDB
    }
}

function getTeacherInDB (teacherID, finalCallback) {

    waterfall([
        function (callback) {
            var query1 = `SELECT * from users LEFT JOIN avLangs ON users.ID = avLangs.userID  WHERE users.ID = ${teacherID};`
            mySqlConnection.query(query1, function (dataObj){
                if(dataObj.error) callback( dataObj.error, null) 
                    
                var teacher = dataObj.results[0]
                delete teacher["pw"]
                delete teacher["email"]
                //Include the data from `avLangs` to the `availableLangs` property of ther teacher
                teacher.availableLangs = {
                    KR: teacher.KR,
                    EN: teacher.EN,
                    CN: teacher.CN,
                    FR: teacher.FR,
                    DE: teacher.DE
                } 
                delete teacher.KR
                delete teacher.EN
                delete teacher.CN
                delete teacher.FR
                delete teacher.DE
    
                // ID is the ID of the avLangs
                // replace the value of the ID of avLangs with the userID of the avLangs
                teacher.ID = teacher.userID
                delete teacher.userID
                callback(null, teacher)
            })
        }, function (teacher, callback){
            var query2 = `SELECT ID, coursename, lang from courses WHERE teacherID = ${teacher.ID};`
            mySqlConnection.query(query2, function (dataObj){
                if(dataObj.error) callback(dataObj.error, null)
                    
                teacher.courses = dataObj.results
                callback(null, teacher)
            })
        }, function(teacher, callback){
            var query3 = `SELECT * from reviews_teachers WHERE teacherID = ${teacher.ID};`
            mySqlConnection.query(query3, function (dataObj) {
                if(dataObj.error) callback(dataObj.error, null)
                
                teacher.reviews = dataObj.results
                callback(null, teacher)
            })
        }, function(teacher, callback){
            var query4 = `SELECT COUNT(ID) AS num FROM lessons WHERE teacherID = ${teacherID} GROUP BY studentID;`
            mySqlConnection.query(query4, function (dataObj) {
                if(dataObj.error) {
                    callback(dataObj.error, null)
                }
                teacher.stuNum = dataObj.results.length === 0? 0: dataObj.results[0].num
                callback(null, teacher)
            })
        }
    ], function(err, teacher){
        
        if(err) finalCallback(err, null)
        finalCallback(null, teacher)
    })
}


function getCourseInDB (courseID, finalCallback) {
    var course;
    var teacher;
    waterfall([
        function(callback){
            var query1 = `SELECT * from courses WHERE ID = ${courseID};`
            mySqlConnection.query(query1, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error, null)
                }else{
                    course = dataObj.results[0]
                    callback(null, course.teacherID)
                }
            })
        },
        function(teacherID, callback){
            var query5 = `SELECT * from reviews_courses WHERE courseID = ${course.ID};`
            mySqlConnection.query(query5, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error, null)

                    
                }else{
                    course.reviews = dataObj.results
                    callback(null, course.teacherID)
                }
            })
        }
        ,function(teacherID, callback){
            var query2 = `SELECT ID, photo, username, avr_score, professional, nationality from users WHERE ID = ${teacherID};`
            mySqlConnection.query(query2, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error)
                }else{
                    teacher = dataObj.results[0]
                    callback(null)
                }
            })
        }, function(callback){
            var query3 = `SELECT COUNT(*) AS courseNum from courses WHERE teacherID = ${teacher.ID};`
            mySqlConnection.query(query3, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error)
                }  

                teacher.crsNum = dataObj.results.length === 0? 0: dataObj.results[0].courseNum
                callback(null)
            })
        }, function (callback){
            var query4 =  `SELECT COUNT(*) AS studentNum from lessons WHERE teacherID = ${teacher.ID} AND confirm = 1 GROUP BY studentID;`
            mySqlConnection.query(query4, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error)
                }
                teacher.stuNum = dataObj.results.length === 0? 0: dataObj.results[0].studentNum
                callback(null)
            })
        }
    ], function(err){
        console.log('err:', err);
        
        if(err) finalCallback(err, null, null)
        finalCallback(null, course, teacher)
    })

}