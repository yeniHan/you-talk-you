var mySqlConnection
var waterfall = require('async-waterfall')
var asyncForeach = require('async-foreach').forEach

module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection
    return {
        signupUserInDB: signupUserInDB,
        loginUserInDB: loginUserInDB,
        doesUserExistInDB: doesUserExistInDB,
        getUserInDB: getUserInDB,
        editUserInfoInDB: editUserInfoInDB,
        getTeachersInDB: getTeachersInDB,
        addReviewInDB: addReviewInDB,
        getMyStudentsInDB: getMyStudentsInDB,
        getMyTeachersInDB: getMyTeachersInDB,
        getAccountInDB: getAccountInDB,
        editAccountInDB: editAccountInDB
    }
}


function signupUserInDB ( username, password, email, userType, callback){
    var query = `INSERT INTO users (username, pw, email, user_type) VALUES ('${username}', '${password}', '${email}', ${userType});`
    mySqlConnection.query(query, function(dataObj){
                    
        
        callback(dataObj.error)
    })
}

function loginUserInDB (username, password, callback){
    var query = `SELECT user_type FROM users WHERE username = '${username}' AND pw = '${password}';`

    mySqlConnection.query(query, function (dataObj) {
                    
        
        callback(dataObj.error, dataObj.results !== null ? dataObj.results[0] : null )
    })
}

function  doesUserExistInDB  (username, callback) {
    var query = `SELECT * FROM users WHERE username = '${username}';`
    
    mySqlConnection.query(query, function(dataObj){
        if(dataObj.error) callback( dataObj.error, null)
        else{
            var doesUserExist =  dataObj.results.length > 0 ? true : false 
            console.log('doeseUserExist;', doesUserExist)
                        

            callback( dataObj.error, doesUserExist)
        }
    })  
}


function getUserInDB (accessToken, finalCallback){
    waterfall([
        function(callback){
            var query1 = `SELECT user_id from accesstokens WHERE access_token = '${accessToken}';`

            mySqlConnection.query(query1 , function (dataObj){
                if(dataObj.error) callback(dataObj.error, null) 
                var userID = dataObj.results[0].user_id
                callback(null, userID)
            })
        }, function (userID, callback){
            var query2 = `SELECT * from users LEFT JOIN avLangs ON users.ID = avLangs.userID WHERE users.ID = ${userID};`

            mySqlConnection.query(query2, function (dataObj){
                if(dataObj.error||dataObj.results.length !== 1) callback( dataObj.error, null) 
                var user = dataObj.results[0]
                delete user["pw"]
                delete user["email"]
                //Include the data from `avLangs` to the `availableLangs` property of ther user
                user.availableLangs = {
                    KR: user.KR,
                    EN: user.EN,
                    CN: user.CN,
                    FR: user.FR,
                    DE: user.DE
                } 
                delete user.KR
                delete user.EN
                delete user.CN
                delete user.FR
                delete user.DE
                user.ID = userID
                callback(null, user)                
            })
        }, function(user, callback){
            if(user.user_type === 1) {
                var query3 = `SELECT ID, coursename, lang from courses WHERE teacherID = ${user.ID};`
                mySqlConnection.query(query3, function (dataObj){
                    if(dataObj.error == null) {
                        user.courses = dataObj.results
                        callback(null, user)
                    }
                    else{
                        callback(dataObj.error, null)
                    }
                })
            }else{
                var courses;
                waterfall([
                    function(cb){
                        var query4 = `SELECT courseID from lessons WHERE studentID = ${user.ID} GROUP BY courseID;`
                        mySqlConnection.query(query4, function(dataObj){
                            if(dataObj.error) cb(dataObj.error, null)
                            var courseIDs = dataObj.results
                            var conditions;
                            if(courseIDs.length !== 0){
                                conditions = courseIDs.map(function(crsIDObj){
                                    return `ID = ${crsIDObj.courseID}`
                                }) 
                                conditions = conditions.join(' OR ')
                            }else conditions = null
                            console.log('err:', dataObj.error)
                            console.log('&******************conditions:', conditions);
                            
                            cb(null, conditions)
                        })
                    }, function(conditions, cb){
                        
                        if(conditions){
                            var query5 = `SELECT ID, coursename, lang FROM courses WHERE ${conditions};`

                            mySqlConnection.query(query5, function(dataObj){
                                if(dataObj.error) cb(dataObj.error, null)
                                else {
                                    var courses = dataObj.results
                                    cb(null, courses)
                                }
                            })
                        }
                        else cb(null, [])
                    }
                ], function(err, courses){
                    console.log('#############inner waterfall')
                    console.log(' err:', err, 'cours:', courses);
                    
                    if(err) callback(err, null)
                    user.courses = courses
                    callback(null, user)
                })
            }
        }
    ], 
    function(err, user){
        console.log('###########final function outer waterfall');
        console.log('user.courses:', user.courses);
        
        
        if(err) finalCallback(err, null)
        finalCallback(null, user)
    })

}



function editUserInfoInDB (  newProfile, finalCallback) {
    var numFields = ['gender','professional','experience']
    var sets = []
    var userID = newProfile.ID
    delete newProfile.ID
    
    var availableLangs = newProfile.availableLangs
    
    delete newProfile.availableLangs

    waterfall([
        function(callback){
            //Delete the previous photo
            if(newProfile.photo !== undefined) {
                var query0 = `SELECT photo from users WHERE ID = ${userID};`
                mySqlConnection.query(query0, function (dataObj){
                    if(dataObj.error) callback(dataObj.error)
                    else if(dataObj.results[0].photo != null){
                        var fs = require('fs')
                        var path = require('path')
                        var p = path.join( __dirname, '..' , 'SRC', 'profilePhotos', dataObj.results[0].photo)
                        if(fs.existsSync(p)) fs.unlinkSync(p)
                    }
                    callback(null)
                })
            }else callback(null)
        }, function(callback){
            for(var field in newProfile){
                var val = newProfile[field]
                if(numFields.indexOf(field) !== -1|| val == null) sets.push(`${field} = ${val}`)
                else {
        
                    sets.push(`${field} = "${val}"`)
                }
            }
            var setStr = sets.join(',')
        
            var query1 = `UPDATE users SET ${setStr} WHERE ID = ${userID};`
            mySqlConnection.query(query1, function(dataObj){
                if(dataObj.error != null ) callback(dataObj.error)
                callback(null)
            })
        }, function(callback){
            var query2 = `SELECT * from avLangs WHERE userID = ${userID};`
            mySqlConnection.query(query2, function (dataObj) {
                
                if(dataObj.error != null ) callback(dataObj.error)
                else if(dataObj.results.length === 0) callback(null, false)
                else callback(null, true)
            })
        }, function(hasAvLangsData, callback){
            var query3 = hasAvLangsData === false ? `INSERT INTO avLangs (userID, KR, EN, CN, FR, DE) VALUES(${userID} ,${availableLangs.KR}, ${availableLangs.EN}, ${availableLangs.CN}, ${availableLangs.FR}, ${availableLangs.DE});`: `UPDATE avLangs SET KR = ${availableLangs.KR}, EN = ${availableLangs.EN}, CN = ${availableLangs.CN}, FR = ${availableLangs.FR}, DE = ${availableLangs.DE} WHERE userID = ${userID};`
    
            mySqlConnection.query(query3, function (dataObj){
                if (dataObj.error ) callback(dataObj.error, null)
                else callback(null, newProfile.photo)
            })
        }
    ],
    function(err, photo){
                    console.log('err:', err, 'photo', photo);
                    
        
        if(err) finalCallback(err, null)
        finalCallback(null, photo)
    })
}


function getTeachersInDB (filter, callback){
    var andConditions = []
    //filter: lang, gender, price, nationality[], avLangs[], professional
    //number fields: gender, professional
    var price = filter.price
    delete filter.price
    if (filter.lang == null) delete filter.lang

    if(price != null) andConditions.push(`price < ${price}`)
    andConditions.push(`user_type = 1`)
    
    //nationality => (condition ) OR (condition ) OR (condition ) 
    var orConditions = []

    for(var field in filter){
        var value = filter[field]
        if((field === 'professional'|| field === 'gender')&& (value !== 'ALL')&&(value != null)) andConditions.push(`users.${field} = ${value}`)
        else if(field === 'nationality'&& value.length !== 0){
            console.log('nationality:[]', value);
            
            for(let i = 0; i < value.length ; i++){
                orConditions.push(`users.nationality = '${value[i]}'`)
            }
        }
        else if(field === 'lang') andConditions.push(`courses.${field} = '${value}'`)
    }

    
    filter.avLangs.forEach(function(lang){
        andConditions.push(`avLangs.${lang} >= 3`)
    })

    orConditions = orConditions.join(' OR ')
    
    andConditions = andConditions.join(' AND ') 
    var conditions = orConditions !== ''? andConditions + ' AND (' + orConditions + ')': andConditions


    mySqlConnection.query(`SELECT users.ID, photo, username, nationality, professional, teachingLangs, price, users.avr_score, KR, EN, CN, DE, FR from users LEFT JOIN avLangs ON users.ID = avLangs.userID LEFT JOIN courses ON users.ID = courses.teacherID WHERE ${conditions} GROUP BY users.ID ORDER BY courses.price;`, function(dataObj){
                        
        if(dataObj.error) {  callback(dataObj.error, null)}
        else {  callback(null, dataObj.results)}
    })

}


function addReviewInDB ( reviewKind, ID, score, review, accessToken, finalCallback) {
    waterfall([
        function(callback){
            var query0 = `SELECT users.username from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}';`

            mySqlConnection.query(query0, function(dataObj){
                if(dataObj.error) callback(dataObj.error)
                var writer = dataObj.results[0].username
                callback(null, writer)
            })
        }, function(writer,callback) {
            if(reviewKind === 'teacher'){
                waterfall([
                    function(cb){
                        var TS = parseInt(Date.now()/60000)
                        var query1 = `INSERT INTO reviews_teachers (score, review, writer, teacherID, TS) VALUES (${score}, "${review}", "${writer}", ${ID}, ${TS});`
                        mySqlConnection.query(query1, function(dataObj){
                            if(dataObj.error) cb(dataObj.error)
                            else {
                                cb(null)
                            }
                        })
                    }, function(cb){
                        var query2 = `SELECT COUNT(*) AS num from reviews_teachers WHERE teacherID = ${ID};`
                        mySqlConnection.query(query2, function(dataObj){
                            if(dataObj.error) cb(dataObj.error)
                            var num = dataObj.results[0].num                            
                            cb(null, num)
                        })
                    }, function(num, cb){
                        var query3 = `SELECT SUM(score) AS sum from  reviews_teachers WHERE teacherID = ${ID};`
                        mySqlConnection.query(query3, function (dataObj){
                            if(dataObj.error) cb(dataObj.error)
                            //Update avr_score in 'users' table
                            var sum = dataObj.results[0].sum
                            var avrScore = parseFloat(sum/num).toFixed(2)
                            cb(null, avrScore)
                        })
                    }, function(avrScore, cb){
                        query4 = `UPDATE users SET avr_score = ${avrScore} WHERE ID = ${ID};`
                        mySqlConnection.query(query4, function(dataObj){
                            if(dataObj.error) cb(dataObj.error)
                            cb(null)
                        })
                    }
                ], function(err){
                    if(err) callback(err)
                    callback(null)
                })
            }else{
                waterfall([
                    function(cb){
                        var query1 = `INSERT INTO reviews_courses (score, review, writer, courseID) VALUES (${score}, "${review}", "${writer}", ${ID});`
                        mySqlConnection.query(query1, function(dataObj){
                            if(dataObj.error) cb(dataObj.error)
                            cb(null)
                        })
                    }, function(cb){
                        //Update the avr_score based on the updated review data..
                        //1. How many reviews
                        //2. Sum of the reviews 
                        var query2 = `SELECT COUNT(*) AS num from reviews_courses WHERE courseID = ${ID};`
                        mySqlConnection.query(query2, function(dataObj){
                            if(dataObj.error) cb(dataObj.error)
                            var num = dataObj.results[0].num
                            cb(null, num)
                        })

                    }, function(num, cb) {
                        var query3 = `SELECT SUM(score) AS sum from  reviews_courses WHERE courseID = ${ID};`
                        mySqlConnection.query(query3, function (dataObj){
                            if(dataObj.error) cb(dataObj.error)
                                //Update avr_score in 'users' table
                            var sum = dataObj.results[0].sum
                            var avrScore = parseFloat(sum/num).toFixed(2)
                            cb(null, avrScore)
                        })
                    }, function (avrScore, cb){
                        query4 = `UPDATE courses SET avr_score = ${avrScore} WHERE ID = ${ID};`
                        mySqlConnection.query(query4, function(dataObj){
                            if(dataObj.error)  cb(dataObj.error)
                            cb(null)
                        })
                    }
                ], function(err){
                    if(err) callback(err)
                    callback(null)
                })
            }
        }
    ], 
    function(err){
        
        if(err) finalCallback(err)
        finalCallback(null)
    })
}


function getMyTeachersInDB (accessToken, finalCallback) {
    var userID;
    waterfall([
        function (callback){
            var query1 = `SELECT user_id from accesstokens WHERE access_token = '${accessToken}';`
            mySqlConnection.query(query1 , function (dataObj){
                if(dataObj.error) callback(dataObj.error, null) 
                userID = dataObj.results[0].user_id
                callback(null, userID)
            })
        }, function(userID, callback){
            var query2 = `SELECT photo, username, teacherID AS ID from lessons LEFT JOIN users ON lessons.teacherID = users.ID WHERE studentID = ${userID} GROUP BY teacherID;`
            mySqlConnection.query(query2 , function (dataObj){
                if(dataObj.error) callback(dataObj.error, null) 
                var teachers = dataObj.results
                callback(null, teachers)
            })
        }, function(teachers, callback){
            asyncForeach(teachers, function(teacher, idx){
                var done = this.async()                

                waterfall([
                    function(cb){
                        var query3 = `SELECT courseID AS ID, coursename from lessons LEFT JOIN courses ON lessons.courseID = courses.ID WHERE studentID = ${userID} AND lessons.teacherID = ${teacher.ID} GROUP BY courseID ORDER BY lessons.ID DESC LIMIT 3;`
                        mySqlConnection.query(query3 , function (dataObj){
                            if(dataObj.error) cb(dataObj.error, null) 
                            else {
                                teacher.courses = dataObj.results
                                cb(null)
                            }
                        })
                    }, function(cb){
                        var query4 = `SELECT COUNT(ID) AS num from lessons WHERE teacherID =${teacher.ID} AND studentID = ${userID};`
                        mySqlConnection.query(query4 , function (dataObj){
                            if(dataObj.error) cb(dataObj.error, null) 
                            teacher.lessonNum = dataObj.results.length === 0? 0 : dataObj.results[0].num
                            teachers[idx] = teacher
                            cb(null)
                        })
                    }
                ], function(err){
                    if(err) done(false)
                    else {
                        done()
                    }
                })
                
            }, function(allDone){
                if(allDone !== true) callback({code: 'DB error'}, null)
                callback(null, teachers)
            })
        }
    ], 
    function(err, teachers){
        
        if(err) finalCallback(err, null)
        finalCallback(null, teachers)
    })
}


function getMyStudentsInDB(accessToken, finalCallback){
    var userID;
    waterfall([
        function(callback){
            var query1 = `SELECT user_id from accesstokens WHERE access_token = '${accessToken}';`
            mySqlConnection.query(query1 , function (dataObj){
                if(dataObj.error) callback(dataObj.error, null) 
                userID = dataObj.results[0].user_id
                callback(null)
            })
        }, function(callback){
            var query2 = `SELECT photo, username, studentID AS ID from lessons LEFT JOIN users ON lessons.studentID = users.ID WHERE teacherID = ${userID} GROUP BY studentID;`
            mySqlConnection.query(query2 , function (dataObj){
                if(dataObj.error) callback(dataObj.error, null) 
                var students = dataObj.results
                if(students.length === 0) finalCallback(null, null)
                else callback(null, students)
            })
        }, function(students, callback){
            asyncForeach(students, function(student, idx){
                var done = this.async()
                waterfall([
                    function (cb){
                        var query3 = `SELECT courseID, coursename from lessons LEFT JOIN courses ON lessons.courseID = courses.ID WHERE courses.teacherID = ${userID} AND lessons.studentID = ${student.ID} GROUP BY courseID ORDER BY lessons.ID DESC LIMIT 3;`
                        mySqlConnection.query(query3 , function (dataObj){
                            if(dataObj.error) cb(dataObj.error) 
                            student.courses = dataObj.results
                            cb(null)
                        })
                    },function(cb){
                        //4. howmany lessons has the student reserved to each student.
                        var query4 = `SELECT COUNT(ID) AS num from lessons WHERE studentID =${student.ID} AND teacherID = ${userID};`
                        mySqlConnection.query(query4 , function (dataObj){
                            if(dataObj.error) cb(dataObj.error) 
                            student.lessonNum = dataObj.results.length === 0? 0 : dataObj.results[0].num
                            students[idx] = student                        
                            cb(null)
                        })

                    }
                ], 
                function(err){
                    if(err) done(false)
                    else {
                        done()
                    }
                })
            }, function(allDone){
                if(allDone) callback(null, students)
                else callback({code: 'DB error'}, null)
            })
        }
    ], function(err, students){
        
        if(err) finalCallback(err, null)
        finalCallback(null, students)
    })
}

function getAccountInDB( accessToken, callback){
    var query = `SELECT users.ID, email from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}';`
    mySqlConnection.query(query , function (dataObj){
        if(dataObj.error) callback(dataObj.error, null) 
        else{
            callback(dataObj.error, dataObj.results[0]) 
        }
    })
}

function editAccountInDB( accessToken, email, oldPw, newPw, finalCallback){
    if(oldPw == null) {
        var userID;
        waterfall([
            function(callback){
                var query2_a = `SELECT users.ID from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}';`
                mySqlConnection.query(query2_a , function (dataObj){
                    if(dataObj.error) callback(dataObj.error, null) 
                    else {
                        userID = dataObj.results[0].ID
                        callback(userID, null)
                    }
                })
            }, 
            function(userID, callback){
                var query1 = `UPDATE users SET email = '${email}' WHERE ID = ${userID};`
                mySqlConnection.query(query1 , function (dataObj){
                    if(dataObj.error) callback(dataObj.error) 
                    else{
                        callback(null)
                    }
                })
            }
        ], function(err){
            if(err) finalCallback(err)
            else finalCallback(null)
        })

    }else if(email == null){
        var userID;
        waterfall([
            function(callback){
                var query2_a = `SELECT users.ID from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}' AND pw = '${oldPw}';`
                mySqlConnection.query(query2_a , function (dataObj){
                    if(dataObj.error) callback(dataObj.error, null) 
                    else if(dataObj.results.length === 0) callback({code: 'Password is not matched with the user\'s account'}, null)
                    else {
                        userID = dataObj.results[0].ID
                        callback(null, userID)
                    }
                })
            }, function(userID, callback){
                var query2_b = `UPDATE users SET pw = '${newPw}' WHERE ID = ${userID};`
                mySqlConnection.query(query2_b , function (dataObj){
                    if(dataObj.error) callback(dataObj.error) 
                    else{
                       callback(null)
                    }
                })
            }
        ],function(err){
            
            if(err) finalCallback(err)
            else finalCallback(null)
        })
    }else{
        var userID;
        waterfall([
            function(callback){
                var query3_a = `SELECT users.ID from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}' AND pw = '${oldPw}';`
                mySqlConnection.query(query3_a , function (dataObj){
                    if(dataObj.error) callback(dataObj.error, null) 
                    else if(dataObj.results.length === 0) callback({code: 'Password is not matched with the user\'s account'}, null) 
                    else {
                        userID = dataObj.results[0].ID
                        callback(null, userID)
                    }
                })
            }, function(userID, callback){
                var query3_b = `UPDATE users SET email = '${email}', pw = '${newPw}' WHERE ID = ${userID};`
                mySqlConnection.query(query3_b , function (dataObj){
                    if(dataObj.error) callback(dataObj.error) 
                    else{
                        callback(null)
                    }
                })
            }
        ], 
        function(err){
            console.log('$$$$$$$$$$$$err:', err);
            
            if(err) finalCallback(err)
            else finalCallback(null)
        })
    }


}


    
