var mySqlConnection

module.exports = function (injectedMySqlConnection) {
    mySqlConnection = injectedMySqlConnection

    return {
        // getProfilePhotoFilenameInDB: getProfilePhotoFilenameInDB
    }

}

// function getProfilePhotoFilenameInDB (photoFilename, callback) {
    
//     var query = `SELECT photo from users WHERE ID = ${photoFilename};`
//     mySqlConnection.query(query, function (dataObj){
//         if(dataObj.error != null) callback(null, dataObj.error)
//         else callback(dataObj.results[0].photo, null)
//     })
// }