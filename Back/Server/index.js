var cors = require('cors')

var port = 8080

var mySqlConnection = require('./DBHelpers/mySqlWrapper')

// DB helpers..
var tokensDBHelper = require('./DBHelpers/tokensDBHelper') (mySqlConnection)
var userDBHelper = require('./DBHelpers/userDBHelper')(mySqlConnection)
var courseDBHelper = require('./DBHelpers/courseDBHelper')(mySqlConnection)
var msgDBHelper = require('./DBHelpers/msgDBHelper')(mySqlConnection)
var srcDBHelper = require('./DBHelpers/srcDBHelper')(mySqlConnection)
var infoDBHelper = require('./DBHelpers/infoDBHelper')(mySqlConnection)
var staticsDBHelper = require('./DBHelpers/staticsDBHelper')(mySqlConnection)


var oAuth2Model = require('./Model/tokenModel')(userDBHelper, tokensDBHelper)
var oAuth2Server = require('./Utils/custom-node-oauth2-server')
var bodyParser = require('body-parser')
var express = require('express')

var app = express()
app.oauth = new oAuth2Server({
    model: oAuth2Model,
    grants: ['password', 'refresh_token'],
    debug: true,
    accessTokenLifetime: 5*60*60,
    refreshTokenLifetime: 24*60*60,
})

// accessTokenLifetime: 3 h
// refreshTokenLifetime: 1 day

//***Routers
var multer = require('multer')
var fs = require('fs')
var storagePP = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  __dirname + '/SRC/profilePhotos')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})
var uploaderPP = multer({storage: storagePP})





var authRouterMethods = require('./Routers/AuthRouter/routerMethods')(userDBHelper)
var authRouter = require('./Routers/AuthRouter/router')(express.Router(), app, authRouterMethods)
var userRouterMethods = require('./Routers/UserRouter/routerMethods')(userDBHelper)
var userRouter = require('./Routers/UserRouter/router')(express.Router(), app,  userRouterMethods)
var courseRouterMethods = require('./Routers/CourseRouter/routerMethods')(courseDBHelper)
var courseRouter = require('./Routers/CourseRouter/router')(express.Router(), app, courseRouterMethods)
var msgRouterMethods = require('./Routers/MsgRouter/routerMethods')(msgDBHelper)
var msgRouter = require('./Routers/MsgRouter/router')(express.Router(), app, msgRouterMethods)
var srcRouterMethods = require('./Routers/SRCRouter/routerMethods')(srcDBHelper)
var srcRouter = require('./Routers/SRCRouter/router')(express.Router(), app, srcRouterMethods)
var infoRouterMethods = require('./Routers/InfoRouter/routerMethods')(infoDBHelper)
var infoRouter = require('./Routers/InfoRouter/router')(express.Router(), app,  infoRouterMethods)
var staticsRouterMethods = require('./Routers/staticsRouter/routerMethods')(staticsDBHelper)
var staticsRouter = require('./Routers/staticsRouter/router')(express.Router(), app,  staticsRouterMethods)



app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/auth', authRouter)
app.use('/user', uploaderPP.single('photo'), userRouter)
app.use('/courses', courseRouter)
app.use('/msgs', msgRouter )
app.use('/src', srcRouter)
app.use('/info', infoRouter)
app.use('/statics', staticsRouter)
app.use(app.oauth.errorHandler())





app.listen(port, function(){
    console.log(`Listening on port ${port}`)
})