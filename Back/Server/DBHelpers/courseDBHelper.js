var mySqlConnection
var waterfall = require('async-waterfall')
var asyncForEach = require('async-foreach').forEach 
var getLastDate = require('../Utils/dateFunctions.js').getLastDate
var getFirstDay = require('../Utils/dateFunctions.js').getFirstDay
var getDateRage = require('../Utils/dateFunctions.js').getDateRage


module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection
    return {
        registerCourseInDB: registerCourseInDB,
        reserveCourseInDB: reserveCourseInDB,
        getMyCoursesInDB: getMyCoursesInDB,
        getMyScheduleInDB: getMyScheduleInDB
    }
}


function registerCourseInDB ( accessToken, course, finalCallback){
    // First find out who the teacher is..; get the ID of the teacher with accessToken.
    var userID;
    var registeredCourse;
    waterfall([ 
        function(callback){
            var query0 = `SELECT user_id from accesstokens WHERE access_token = '${accessToken}';`
            mySqlConnection.query(query0, function(dataObj){
                userID = dataObj.results[0].user_id 
                if(dataObj.error) callback(dataObj.error, null)
                callback(null, userID)
            })
        },
        function(userID, callback) {
            var query1 =  course.videoURL == null? 
             `INSERT INTO courses (teacherID, coursename, lang, introduction, price, unitTime, period, videoURL, regDate) VALUES ( ${userID}, '${course.coursename}', '${course.lang}', '${course.introduction}', '${course.price}', '${course.unitTime}', '${course.period}', ${course.videoURL}, now());` 
             : `INSERT INTO courses (teacherID, coursename, lang, introduction, price, unitTime, period, videoURL, regDate) VALUES ( ${userID}, '${course.coursename}', '${course.lang}', '${course.introduction}', '${course.price}', '${course.unitTime}', '${course.period}', '${course.videoURL}', now());` 
             mySqlConnection.query(query1, function(dataObj){
                if(dataObj.error) callback(dataObj.error, null)                
                callback(null)
            })
        }, function(callback){
            var query2 = `SELECT ID, coursename, lang from courses ORDER BY ID DESC LIMIT 1;`
            mySqlConnection.query( query2, function(dataObj){
                if(dataObj.error) callback(dataObj.error)                
                registeredCourse = dataObj.results[0]
                callback(null)
            })
            
        }, function(callback){
            var query3 = `SELECT teachingLangs from users WHERE ID = ${userID};`
            mySqlConnection.query(query3, function (dataObj){
                if(dataObj.error) callback(dataObj.error, null)
                callback(null, dataObj.results.teachingLangs)
            })
        }, function(teachingLangs, callback){
            if(teachingLangs == null || ''){
                var query4_1 = `UPDATE users SET teachingLangs = '${course.lang}' WHERE ID = ${userID};`
                mySqlConnection.query(query4_1, function (dataObj){
                    if(dataObj.error) callback(dataObj.error)
                    callback(null)
                })
            }else{
                teachingLangs = teachingLangs.split('/')
                //If the value of the teachingLangs doesn't include the lang of the new course, update it
                if(teachingLangs.indexOf(course.lang) === -1) {
                    teachingLangs.push(course.lang)
                    teachingLangs = teachingLangs.join('/')
                
                    var query4_2 = `UPDATE users SET teachingLangs = '${teachingLangs}' WHERE ID = ${userID};`
                    mySqlConnection.query(query4_2, function (dataObj){
                        if(dataObj.error) callback(dataObj.error)
                        callback(null)
                    })
                }else{
                    callback(null)
                }
            }
        }
    ], function(err){
        
        if(err) finalCallback(err, null)
        finalCallback(null, registeredCourse)
    })
    
}

function reserveCourseInDB(accessToken, courseID, coursename, startTS, endTS, teacherID, msg, finalCallback){
    var studentID;
    var studentUsername;
    waterfall([
        function(callback){
            var query1 = `SELECT username, user_id from accesstokens INNER JOIN users ON users.ID  = accesstokens.user_id  WHERE access_token = '${accessToken}';`

            mySqlConnection.query(query1, function(dataObj){
                if(dataObj.error) {
                    
                    callback(dataObj.error); 
                
                }else {
                    studentID = dataObj.results[0].user_id
                    studentUsername = dataObj.results[0].username
                    callback(null)
                }
            })

        }, function(callback){
            var query2 = `INSERT INTO lessons (courseID, studentID, teacherID, startTS, endTS) VALUES (${courseID}, ${studentID}, ${teacherID}, '${startTS}', '${endTS}');`
            mySqlConnection.query(query2, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error)
                }
                else callback(null)
            })
        }, function (callback){
            var query3 = `SELECT ID from lessons ORDER BY ID DESC LIMIT 1;`
            mySqlConnection.query(query3, function(dataObj){
                if(dataObj.error) callback(dataObj.error, null)
                else{    
                    var lessonID = dataObj.results[0].ID 
                    callback(null, lessonID)
                }
            })

        }, function(lessonID, callback){
            var content = `${studentUsername}/${coursename}/ ${startTS}/${endTS})/${msg}`
            var now = parseInt(Date.now()/60000)
            var query4 = `INSERT INTO msgs (\`from\`, fromName, \`to\` , lessonID, content,\`ts\`, type) VALUES (${studentID}, '${studentUsername}', ${teacherID}, ${lessonID} ,'${content}', ${now}, 1);`
            mySqlConnection.query(query4, function(dataObj){
                if(dataObj.error) {
                    callback(dataObj.error)
                    console.log('############err:',dataObj.error);
                    
                }
                else {callback(null)}
            })
        }
    ], function(err){
        if(err) finalCallback(err)
        else finalCallback(null)
    })
}


function getMyCoursesInDB ( accessToken, userType, finalCallback){
    if(userType === 1){
        waterfall([
            function(callback){
                var query1_a = `SELECT courses.ID, coursename, regDate from courses LEFT JOIN accesstokens ON accesstokens.user_id = courses.teacherID WHERE access_token = '${accessToken}' ORDER BY courses.ID DESC;`
                mySqlConnection.query(query1_a, function(dataObj){
                    if(dataObj.error) callback(dataObj.error, null)
                    var courses = dataObj.results
                    callback(null, courses)
                })
            }, function(courses, callback){
                asyncForEach(courses, function(course, idx){
                    var done = this.async()
                    waterfall([
                        function(cb){
                            var query1_b = `SELECT COUNT(ID) AS num from lessons WHERE courseID = ${course.ID} GROUP BY studentID;` 
                            mySqlConnection.query(query1_b, function(dataObj){
                                if(dataObj.error) {
                                    cb(dataObj.error, null)
                                }
                                course.stuNum = dataObj.results.length === 0? 0 : dataObj.results[0].num
                                cb(null, course)
                            })
                        }, function(course, cb){
                            var query1_c = `SELECT COUNT(ID) AS num from lessons WHERE courseID = ${course.ID} AND confirm = 1;` 
                            mySqlConnection.query(query1_c, function(dataObj){
                                if(dataObj.error) cb(dataObj.error)
                                course.lessNum = dataObj.results.length === 0? 0 : dataObj.results[0].num
                                courses[idx] = course
                                cb(null)

                            })
                        }
                    ], 
                    function(err){
                        
                        if(err) done(false)
                        else done()
                    })
                }, function(allDone){
                    if(!allDone) callback({code: 'DB error'})
                    else callback(null, courses)
                })
            }
        ], function(err, courses){
            console.log('%%%%%% err:', err, 'courses:', courses);
            
            if(err) finalCallback(err, null)
            finalCallback(null, courses)
        })
    }else{
        var studentID;
        waterfall([
            function (callback) {
                var query2_a = `SELECT users.ID from users LEFT JOIN accesstokens ON accesstokens.user_id = users.ID WHERE access_token = '${accessToken}';`
                mySqlConnection.query(query2_a, function(dataObj){
                    if(dataObj.error){
                         callback(dataObj.error, null)
                    }
                     studentID = dataObj.results[0].ID
                    callback(null, studentID)
                })
            }, function( studentID, callback){
                var query2_b = `SELECT courseID AS ID, coursename from lessons LEFT JOIN courses ON lessons.courseID = courses.ID WHERE studentID = ${studentID} GROUP BY courseID;`
                mySqlConnection.query(query2_b, function(dataObj){
                    if(dataObj.error) callback(dataObj.error, null)
                    var courses = dataObj.results
                    callback(null, courses)
                })
            }, function(courses, callback){
                var err;
                asyncForEach(courses, function(course, idx){
                    var done = this.async()
                    var query2_c = `SELECT COUNT(ID) AS num from lessons WHERE studentID = ${studentID} AND courseID = ${course.ID};`
                    mySqlConnection.query(query2_c, function(dataObj){
                        if(dataObj.error) {
                            err = dataObj.error
                            done(false)
                        }
                        else{ 
                            course.lessNum = dataObj.results.length === 0? 0 : dataObj.results[0].num
                            courses[idx] = course
                            done()
                        }
                    })
                },function(allDone){
                    if(!allDone) callback(err, null)
                    else callback(null, courses)
                })
            }
        ], function(err, courses){
            console.log('courses:', courses);
            
            if(err) finalCallback(err, null)
            else finalCallback(null, courses)
        })
    }

}


function getMyScheduleInDB (accessToken, userType, utcOffset, finalCallback){
    let userID;
    var dt = new Date()
    var cur_m = dt.getMonth() + 1
    var next_m = cur_m === 12? 1 : cur_m + 1
    var prev_m = cur_m === 1 ? 12 : cur_m - 1
    var ranges = [ getDateRage(prev_m, -utcOffset), getDateRage(cur_m, -utcOffset), getDateRage(next_m, -utcOffset)]
    
    waterfall([
        function(callback){
            var query1 = `SELECT user_id from accesstokens WHERE access_token = '${accessToken}' GROUP BY user_id;`
            mySqlConnection.query(query1, function (dataObj){
                if(dataObj.error) callback(dataObj.error, null)
                userID =dataObj.results[0].user_id
                callback(null)
            })
        }, function(callback){

            var lessons3M = []
            var err;
            asyncForEach(ranges, function(item, idx){
                var done = this.async()

                var query2 = userType === 0 ? `SELECT startTS, endTS, username, coursename, confirm from lessons LEFT JOIN users ON users.ID = lessons.teacherID LEFT JOIN courses ON lessons.courseID = courses.ID WHERE lessons.studentID = ${userID} AND lessons.startTS >= ${ranges[idx][0]} AND lessons.startTS <= ${ranges[idx][1]};` :
                `SELECT startTS, endTS, username , coursename, confirm from lessons LEFT JOIN users ON users.ID = lessons.studentID LEFT JOIN courses ON lessons.courseID = courses.ID WHERE lessons.teacherID = ${userID} AND lessons.startTS >= ${ranges[idx][0]} AND lessons.startTS <= ${ranges[idx][1]};`
                
                mySqlConnection.query(query2, function (dataObj){
                    if(dataObj.error){
                        err = dataObj.error
                         done(false)
                    }
                    let lessons = dataObj.results 
                    lessons3M.push(lessons)
                    done()
                })
            }, function (allDone) {
                if(!allDone) callback(err, null)
                callback(null, lessons3M)
            })

        }], function(err, lessons3M){
        
        if(err) finalCallback(err, null)
        
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]
        let dt = new Date()
        let currM = dt.getMonth() + 1
                
        let prevM = currM - 1  === 0? 12: currM - 1
        let nextM = currM + 1  === 13? 1: currM + 1
        prevM= [prevM, getFirstDay(prevM), getLastDate(prevM)]
        currM= [currM,  getFirstDay(currM), getLastDate(currM)]
        nextM= [nextM, getFirstDay(nextM), getLastDate(nextM)]
        
        lessons3M.forEach(function(month, idx){
            month.forEach(function(ls, idxx) {
                let date = new Date(ls.startTS*60000 - utcOffset*60000).getUTCDate()
                
                month[idxx] = [date, ls]
            })
            
            if(idx === 0) { 
                prevM.push(month)
                
                lessons3M[idx] = prevM
                // lessons[]
            }
            else if(idx === 1) {
                currM.push(month)                                
                lessons3M[idx] = currM
            }
            else{ 
                nextM.push(month)                                                                
                lessons3M[idx] = nextM
            }
        })
        
        let infoForCals = [[], [], []]
            
        lessons3M.forEach(function (thisMLs, idx) {
            let infos = []
            let count = 0;
            let firstDay = thisMLs[1]
            let lastDate = thisMLs[2] 
            let thisMlessons = thisMLs[3]   
            for(let i  = infoForCals[idx].length ;  i < 35; i ++ ){
                if(i < firstDay) infos.push([null, []])
                else {
                    // [date, {lesson info}]
                    let lsForThisDay = []
                    let thisDay = count + 1
                    if(thisDay <= lastDate){
                        thisMlessons.forEach(function (ls) {
                        
                            //The date of the lesson is same, push the lesson 
                            if(thisDay === ls[0]) lsForThisDay.push(ls[1])
                        })
                        infos.push([thisDay , lsForThisDay])
                        count ++
                    }else{
                        infos.push([null , []])                                        
                    }   
                }
            }   
            infoForCals[idx] = infoForCals[idx].concat(infos)
            // In this case.. store info the next arr's info
            let infosForNextInfo  = []
            if(count < lastDate) {
                for(let i = 0 ; i < lastDate - count; i++ ){
                    let lsForThisDay = []
                    let thisDay = count + 1
                    thisMlessons.forEach(function(ls) {
                        if(thisDay === ls[0]) lsForThisDay.push(ls[1])
                    })
                    let thisMonthVal = thisMLs[0]
                    infosForNextInfo.push([thisMonthVal + '/' + thisDay , lsForThisDay])
                    count ++
                }
                infoForCals[idx +1 ] = infosForNextInfo
            }
        })
        finalCallback(null, infoForCals)            
    })
}

