module.exports = function (router, app, routerMethods){
    
    router.get('/profilePhoto/:photoFilename', routerMethods.getProfilePhoto)
    
    return router
}