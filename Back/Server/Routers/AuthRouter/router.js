

module.exports = function (router, app, routerMethods){

    
    router.post('/signup', routerMethods.signupUser)
    router.post('/login', app.oauth.grant())
    router.post('/refresh', app.oauth.grant())    

    return router
}