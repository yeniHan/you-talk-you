module.exports = function (router, app,  routerMethods){
    
    router.get('/teacher/:teacherID', app.oauth.authorise(), routerMethods.getTeacher)
    router.get('/course/:courseID',  app.oauth.authorise(), routerMethods.getCourse)
    
    return router
}