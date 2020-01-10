module.exports = function (router, app, routerMethods){
    
    router.post('/profile/show', app.oauth.authorise(),  routerMethods.showProfile)
    router.post('/profile/edit', app.oauth.authorise(),  routerMethods.editProfile)
    router.post('/teachers',  app.oauth.authorise(), routerMethods.getTeachers)
    router.post('/review', app.oauth.authorise(),  routerMethods.addReview)
    router.post('/myteachers', app.oauth.authorise(),  routerMethods.getMyTeachers)
    router.post('/mystudents', app.oauth.authorise(),  routerMethods.getMyStudents)
    router.post('/account/get', app.oauth.authorise(),  routerMethods.getAccount)
    router.post('/account/edit', app.oauth.authorise(),  routerMethods.editAccount)
    
    return router
}