var courseDBHelper; 

function register (req, res) {
    var course = req.body.course
    var accessToken = req.headers.authorization.split(' ')[1]
    var hasNewMsg = req.body.hasNewMsg    
    
    courseDBHelper.registerCourseInDB(accessToken, course, function (err, registeredCourse) {
        if(err != null) sendResponse(res, err.code, {}, true, 'CO1')
        else sendResponse(res, 'Registered the course successfully.', {hasNewMsg: hasNewMsg, registeredCourse: registeredCourse}) 
    })
}

function reserve (req, res){
    var accessToken = req.headers.authorization.split(' ')[1]    
    var courseID = req.body.courseID
    var coursename = req.body.coursename    
    var msg = req.body.msg
    var teacherID = req.body.teacherID
    var hasNewMsg = req.body.hasNewMsg
    var startTS = req.body.startTS
    var endTS = req.body.endTS
   
    
    courseDBHelper.reserveCourseInDB( accessToken, courseID, coursename, startTS, endTS, teacherID, msg, function (err){
        if(err) sendResponse(res, err.code, {}, true, 'Res')
        else sendResponse(res, 'Successfuly reserved the lesson.', {hasNewMsg: hasNewMsg})
    })

}


function getMyCourses (req, res){
    var accessToken = req.headers.authorization.split(' ')[1]
    var userType = req.body.userType
    var hasNewMsg = req.body.hasNewMsg
    
    courseDBHelper.getMyCoursesInDB( accessToken, userType, function(err, courses){
        if(err) sendResponse(res, err.code, {}, true, 'Rsv')
        else sendResponse(res, 'Successfuly confirmed the reservation.', { 
            courses: courses,
            hasNewMsg: hasNewMsg
        })
    })    
}


function getMySchedule (req, res){
    var accessToken = req.headers.authorization.split(' ')[1]
    var userType = req.body.userType
    var utcOffset = req.body.utcOffset    
    var hasNewMsg = req.body.hasNewMsg
    
    
    courseDBHelper.getMyScheduleInDB( accessToken, userType, utcOffset, function(err, infoForCals){
        console.log('infoFoCals:', infoForCals);
        console.log('err?;', err);
            
        if(err) sendResponse(res, err.code, {}, true, 'Rsv')
        else sendResponse(res, 'Successfuly confirmed the reservation.', { 
            infoForCals : infoForCals,
            hasNewMsg: hasNewMsg
        })
    })    
}





function sendResponse(res, message, otherInfo = {}, err = null, errCode=null){
    // otherInfo = otherInfo === null? {} : otherInfo
    console.log('err:', err != null);
    
    res.status(err != null? 400 : 200)
    .json({
        "message": message,
        "error": err,
        "code": errCode,
        ...otherInfo
    })
    res.end()
}



module.exports = function (injectedDBHelper) {
    courseDBHelper = injectedDBHelper
    return {
        register: register,
        reserve: reserve,
        getMyCourses: getMyCourses,
        getMySchedule: getMySchedule

    }
}