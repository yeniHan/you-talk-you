module.exports = function (router, app,  routerMethods ){

    router.post('/register', app.oauth.authorise() ,  routerMethods.register)
    router.post('/reserve', app.oauth.authorise() ,  routerMethods.reserve)
    router.post('/mycourses', app.oauth.authorise() ,  routerMethods.getMyCourses)
    router.post('/schedule', app.oauth.authorise() ,  routerMethods.getMySchedule)
    

    return router
}