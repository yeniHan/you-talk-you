function getProfilePhoto(req, res) {
    var photoFilename = req.params.photoFilename

    var resolve = require('path').resolve
    var path = resolve(`./SRC/profilePhotos/${photoFilename}`)
    res.sendFile(path)
    

}

function sendResponse(res, message, otherInfo = {}, err = null, errCode=null){
    // otherInfo = otherInfo === null? {} : otherInfo
    res.status(err !=null? 400 : 200)
    .json({
        "message": message,
        "error": err,
        "code": errCode,
        ...otherInfo
    })
   res.end()
    
}

module.exports = function (injectedDBHelper) {
    srcDBHelper = injectedDBHelper
    return {
        getProfilePhoto: getProfilePhoto
    }
}