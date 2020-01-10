module.exports = function (router, app,  routerMethods){
    
    router.post('/read', app.oauth.authorise(), routerMethods.setRead)
    router.post('/get',app.oauth.authorise(),  routerMethods.getMsgs)
    router.post('/send',app.oauth.authorise(),  routerMethods.sendMsg)
    
    
    return router
}