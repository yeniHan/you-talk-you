var userDBHelper;

function signupUser (req, res) {
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var userType = req.body.userType
    console.log('userType', isNaN(userType))

    if(!isString(username)|| !isString(password)|| !isString(email)|| isNaN(userType)){
        return sendResponse(res, "Invalid Credentials", true, "Si1")
    }

    userDBHelper.doesUserExistInDB( username, function(err, userExist){
        if(err) sendResponse(res, err.code, true, "Si3")
        else if(userExist) sendResponse(res, "Username already exists", true, "Si2")        
        else userDBHelper.signupUserInDB(username, password, email, userType, function(err){
            if(err) sendResponse(res, err.code, true, "Si3")
            else sendResponse(res, 'Signup was successful.')
        })
    })

}


function loginUser(req, res, next){
    

}

function sendResponse(res, message, err= false, errCode= null){
    res.status(err != null? 400 : 200)
    .json({
        "message": message,
        "error": err,
        "code": errCode
    })
    res.end()
}

function isString(value){
    return value != null && (typeof value === 'string'|| value instanceof String )? true: false
}



module.exports = function (injectedUserDBHelper){
    userDBHelper = injectedUserDBHelper

    return {
        signupUser: signupUser,
        loginUser: loginUser
        
    }
}