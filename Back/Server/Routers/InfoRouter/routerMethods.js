var infoDBHelper;

module.exports = function (injectedDBHelper){
    infoDBHelper = injectedDBHelper

    return {
        getTeacher: getTeacher,
        getCourse: getCourse
    }
}

function getTeacher(req, res){
    var teacherID = req.params.teacherID
    var hasNewMsg = req.body.hasNewMsg
    
    infoDBHelper.getTeacherInDB(teacherID, function (err, teacher){
        if(err) sendResponse(res, err.code, {}, true, 'GT')
        else sendResponse(res, 'Successfully get the matching teacher', 
        { teacher: teacher, hasNewMsg: hasNewMsg})
    })

}


function getCourse (req, res) {
    var courseID =  req.params.courseID
    var hasNewMsg = req.body.hasNewMsg
    console.log('hasNewMsg:', req.body.hasNewMsg);
    
    
    
    infoDBHelper.getCourseInDB(courseID, function (err, course, teacher){
        if(err) sendResponse(res, err.code, {}, true, 'GT')
        else sendResponse(res, 'Successfully get the matching teacher', 
        {   course: course, 
            teacher: teacher,
            hasNewMsg: hasNewMsg
        })
    })
}


function sendResponse(res, message, otherInfo = {}, err = null, errCode=null){
    res.status(err != null? 400 : 200)
    .json({
        message: message,
        error: err,
        code: errCode,
        ...otherInfo
    })
    res.end()
}

