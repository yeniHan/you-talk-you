var userDBHelper; 

function showProfile (req, res){

    var accessToken = req.headers.authorization.split(' ')[1]
    var hasNewMsg = req.body.hasNewMsg
    
    userDBHelper.getUserInDB(accessToken, function (err, user){
        
        if(err != null){
            sendResponse(res, err.code, {}, true, 'Pr1')
        }
        else sendResponse(res, '', { profile: user, hasNewMsg: hasNewMsg })
    })
}

function editProfile(req, res){

    
    var hasNewMsg = req.body.hasNewMsg
    
    var newProfile = JSON.parse(req.body.newProfile)
    

    if(req.file!== undefined) newProfile.photo = req.file.filename
    
    userDBHelper.editUserInfoInDB( newProfile, function(err, photo){
        if(err) {
            sendResponse(res, err.code, {}, true, 'Pr2')
        }
        else sendResponse(res, 'The profile was successfully edited', { hasNewMsg: hasNewMsg, photo: photo })
    })
}


function getTeachers (req, res) {
    var filter = req.body.filter
    var hasNewMsg = req.body.hasNewMsg
    console.log('getTeachers() filter:', filter);
    
    userDBHelper.getTeachersInDB(filter, function (err, teachers) {
        if(err != null) sendResponse(res, err.code, {}, true, 'DB')
        sendResponse(res, 'Successfully get the filtered teachers' , 
        {   
            teachers: teachers, 
            hasNewMsg: hasNewMsg
        })
    })
}



function addReview (req, res) {
    //Is it the review for a course or a teacher?
    //reviewKind values: 'teacher'/ 'course'
    //ID: the ID of the teacher /the ID of the course
    var accessToken = req.headers.authorization.split(' ')[1]
    var reviewKind = req.body.reviewKind
    var ID = req.body.ID    
    var score = req.body.score
    var review = req.body.review
    var hasNewMsg = req.body.hasNewMsg
    

    userDBHelper.addReviewInDB( reviewKind, ID, score, review, accessToken, function (err){
        if(err) sendResponse(res, err.code, {}, true, 'Rev')
        else sendResponse(res, 'Successfuly registered the review', { hasNewMsg: hasNewMsg })
    })
    
}





function getMyTeachers (req, res) {
    var accessToken = req.headers.authorization.split(' ')[1]
    var hasNewMsg = req.body.hasNewMsg    

    userDBHelper.getMyTeachersInDB( accessToken, function (err, teachers){
        if(err) sendResponse(res, err.code, {}, true, 'Myt')
        else sendResponse(res, 'Successfuly got users\' teachers', { 
            hasNewMsg: hasNewMsg,
            myTeachers: teachers
         })
    })
    
}



function getMyStudents (req, res) {
    var accessToken = req.headers.authorization.split(' ')[1]
    var hasNewMsg = req.body.hasNewMsg
    

    userDBHelper.getMyStudentsInDB(  accessToken, function (err, students){
        if(err) sendResponse(res, err.code, {}, true, 'Mys')
        else sendResponse(res, 'Successfuly got user\'s students', {
             hasNewMsg: hasNewMsg,
             myStudents: students
            })
    })
}




function editAccount(req, res){
    var email = req.body.email
    var oldPw = req.body.oldPw
    var newPw = req.body.newPw
    var accessToken = req.headers.authorization.split(' ')[1]
    var hasNewMsg = req.body.hasNewMsg
    
    

    userDBHelper.editAccountInDB( accessToken, email , oldPw, newPw, function(err){
        if(err) sendResponse(res, err.code, {}, true, 'Acc')
        else sendResponse(res, 'Successfuly edit the account', {
             hasNewMsg: hasNewMsg
            })
    })

}


function getAccount(req, res){
    var accessToken = req.headers.authorization.split(' ')[1]
    var hasNewMsg = req.body.hasNewMsg
    
    
    userDBHelper.getAccountInDB( accessToken, function(err, account){
        if(err) sendResponse(res, err.code, {}, true, 'Acc')
        else sendResponse(res, 'Successfuly got the account', {
             hasNewMsg: hasNewMsg,
             account: account
            })
    })

}



function sendResponse(res, message, otherInfo = {}, err = null, errCode=null){
    // otherInfo = otherInfo === null? {} : otherInfo
    // let setHeaders = new Promise( function(res, rej){
        //  res.status)
    // })
    console.log('err:', err, 'info:', otherInfo);
    
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
    userDBHelper = injectedDBHelper
    return {
        showProfile: showProfile,
        editProfile: editProfile,
        getTeachers: getTeachers,
        addReview: addReview,
        getMyStudents: getMyStudents,
        getMyTeachers: getMyTeachers,
        getAccount: getAccount,
        editAccount: editAccount
    }
}

