function getMsgs (req, res){
    var accessToken = req.headers.authorization.split(' ')[1]    
    var hasNewMsg = req.body.hasNewMsg
    

    msgDBHelper.getMsgsInDB( accessToken, function(err, msgs){
        if(err) sendResponse(res, err.code, {}, true, 'Msg')
        else sendResponse(res, 'Successfully get messages', { 
            msgs: msgs,
            hasNewMsg: hasNewMsg
        })
    })
}


function setRead(req, res){
    var msgID = req.body.ID
    var type = req.body.type
    var lessonID = req.body.lessonID
    var hasNewMsg = req.body.hasNewMsg
    var accessToken = req.headers.authorization.split(' ')[1]
    
    
    msgDBHelper.setReadInDB(accessToken, msgID, type, lessonID, function(err, newHasNewMsg){
        if(err) sendResponse(res, err.code, {}, true, 'Msg')
        else sendResponse(res, 'Successfuly set the read of the msg', { hasNewMsg: newHasNewMsg })
    })


}


function sendMsg(req, res){
    var to = req.body.to
    var content = req.body.content
    var hasNewMsg = req.body.hasNewMsg
    var accessToken =  req.headers.authorization.split(' ')[1]
    

    msgDBHelper.sendMsgInDB(  content, to, accessToken, function (err) {
        if(err) sendResponse(res, err.code, {}, true, 'Msg')
        else sendResponse(res, 'Successfuly send the message', { hasNewMsg: hasNewMsg })
    })
}



function sendResponse(res, message, otherInfo = {}, err = null, errCode=null){
    // otherInfo = otherInfo === null? {} : otherInfo
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
    msgDBHelper = injectedDBHelper
    return {
        getMsgs: getMsgs,
        setRead: setRead,
        sendMsg: sendMsg
    }
}