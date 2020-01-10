module.exports = function (router, app, routerMethods){
    
    router.post('/', routerMethods.getStatics)
    
    return router
}