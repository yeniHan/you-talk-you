var staticsDBHelper;

function getStatics (req, res, router){
    var accessToken = req.headers.authorization.split(' ')[1]
    var utcOffset = req.body.utcOffset    
    var hasNewMsg = req.body.hasNewMsg


    staticsDBHelper.getStaticsInDB(accessToken, utcOffset, function (err, statics){
        if(err) sendResponse(res, err.code, {}, true, 'Sta')
        else sendResponse(res, 'Successfuly get statics.', { 
            statics: statics,
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
    staticsDBHelper = injectedDBHelper
    return {
        getStatics: getStatics
    }
}

