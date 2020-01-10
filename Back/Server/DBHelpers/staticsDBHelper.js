var mySqlConnection
var waterfall = require('async-waterfall')
var asyncForEach = require('async-foreach').forEach 
var getDateRage = require('../Utils/dateFunctions.js').getDateRage


module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection

    return {
        getStaticsInDB: getStaticsInDB
    }

}


function getStaticsInDB(accessToken, utcOffset, finalCallback){
    var statics = {
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null
    }
    var teacherID;
    var currM = new Date().getMonth() + 1
    var ranges = [getDateRage(currM -4, -utcOffset), getDateRage(currM - 3, -utcOffset), getDateRage(currM - 2, -utcOffset), getDateRage(currM - 1, -utcOffset), getDateRage(currM, -utcOffset) ]
    
    waterfall([
        // 0. Who is the teacher
        function(callback){
            mySqlConnection.query(`SELECT users.ID from users LEFT JOIN accesstokens ON users.ID = accesstokens.user_id WHERE access_token = '${accessToken}';`, function(dataObj){
                if(dataObj.error) callback(dataObj.error)
                else{
                    teacherID = dataObj.results[0].ID
                    callback(null)
                }
            })

        },
        // 1. Lessons numbers of each of the latest 5 monthes
        //  =? [[monthVal, lessonsNum],* 5]
        function (callback){
            // 1) get ts ranges
            
            var lessons5M = []
            var monthVals = [currM -4, currM -3, currM -2, currM - 1, currM ]
            var err;
            asyncForEach(ranges, function (range, idx){
                var done = this.async()
                mySqlConnection.query(`SELECT COUNT(ID) AS num FROM lessons WHERE startTS >= ${range[0]} AND startTS <= ${range[1]} AND teacherID = ${teacherID}`, function(dataObj){
                    if(dataObj.error) {
                        err = dataObj.error
                        done(false)
                        callback(dataObj.error, null)
                    }
                    else{
                        done()
                        lessons5M.push([ monthVals[idx], dataObj.results[0] === undefined? 0 : dataObj.results[0].num])
                    }
                })
            }, function(allDone){
                
                if(!allDone) callback({code: err.code }, null)
                else{
                    statics.chart1 =  lessons5M
                    callback(null)
                }
            })

             
        }, function (callback){
            // 2. lesson num of each 5 Course of which lessons are most. 
            // [{ID:.. , coursename:..., lessNum: ...}, {..}, ...]
            waterfall([
                function(cb){
                    // 1) courseIds
                    mySqlConnection.query(`SELECT ID, coursename from courses WHERE teacherID = ${teacherID};`, function (dataObj){
                        if(dataObj.error) cb(dataObj.error)
                        else cb(null, dataObj.results)
                    })
                },
                function( courses, cb){
                    asyncForEach(courses, function(course, idx){
                        var done = this.async()
                        mySqlConnection.query(`SELECT COUNT(ID) AS num from lessons WHERE courseID = ${course.ID};`, function(dataObj){
                            if(dataObj.error) done(false)
                            else {
                                courses[idx].lessNum =  dataObj.results[0] === undefined ? 0: dataObj.results[0].num
                                done()
                            }
                        })
                        
                    }, function(allDone){
                        if(!allDone) cb({code: 'DB error'})
                        else cb(null, courses)
                    })
                }
            ], function(err, courses){
                // courses = [{ID:.. , coursename:..., lessNum: ...}, {..}, ...]
                //order and then slice 5 courses 
                courses = courses.sort(function(a, b){
                    return b.lessNum - a.lessNum
                }).slice(0, 5) 

                if(err) callback(err)
                else{
                    statics.chart2 = courses 
                    callback(null)
                }
            }) 
        }, function (callback){
            // 3. Student numbers by nationality
            // {KR:.. , US: ..., ... }
            var data = {}

            var nationalities = ['KR', 'US', 'DE', 'FR', 'CN'] 
            var err;
            asyncForEach(nationalities, function(nt, idx){
                var done = this.async()
                mySqlConnection.query(`SELECT COUNT(studentID) AS num from lessons LEFT JOIN users ON lessons.studentID = users.ID WHERE nationality = '${nt}' AND teacherID = ${teacherID} GROUP BY studentID;`, function(dataObj){
                    if(dataObj.error) {
                        err = dataObj.error;
                        console.log(dataObj.error);
                        done(false)
                    }else {
                        data[nt] = dataObj.results[0] === undefined ? 0:  dataObj.results[0].num
                        done()
                    }
                })
            }, function(allDone){
                if(!allDone) callback({code: err.code})
                else {
                    statics.chart3 = data
                    callback(null)
                }
            })
        }, function(callback){
            // 4. Review score of the lastest 5 monthes
            // [[monthVal, avScore], * 5 ]
            
            var monthValCount = currM - 4
            var data = []
            var err;
            asyncForEach(ranges, function (range){
                var done = this.async()

                mySqlConnection.query(`SELECT score from reviews_teachers WHERE teacherID = ${teacherID} AND TS >= ${range[0]} AND TS <= ${range[1]};`, function(dataObj){
                    if(dataObj.error) {
                        err = dataObj.error
                        console.log(dataObj.error);
                        
                        done(false)
                    }else {
                        // [[monthval, [{score:.. }, {score: ...} ...]]* 5]]
                        data.push([ monthValCount, dataObj.results ])
                        monthValCount ++
                        done()
                    }
                })

            }, function(allDone){
                
                if(!allDone){
                    callback({code:'DB error'})
                }else{
                        
                        data.forEach(function(mNscores, idx){
                            let scores = mNscores[1]
                            let num = scores.length
                            let sum = 0
                            
                            
                            if(num === 0){
                                data[idx][1] = 0
                            }else{
                                scores.forEach(function (item){
                                    sum = sum + item.score
                                })
                                data[idx][1] = Number.parseFloat(sum/num).toFixed(2)
                            }
                        })
                    statics.chart4 = data
                    callback(null)
                }
            })
        }
    ], function(err){
        
        if(err) finalCallback(err, null)
        else finalCallback(null, statics)
    })

}