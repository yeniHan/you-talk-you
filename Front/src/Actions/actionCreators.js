import * as ActionTypes from './ActionTypes';
import  sha256  from 'sha256';
import { URLSearchParams } from 'url';
import ExpiredStorage from 'expired-storage';
import authFetch from '../Utils/authFetch';
import authAxios from '../Utils/authAxios';

let storage = new ExpiredStorage()

// For error
export const addError = (errorMsg, errorCode = null) => {
    return {
        type: ActionTypes.ADD_ERROR,
        message: errorMsg,
        code: errorCode
    }
}

export const deleteError = () => {
    return {
        type: ActionTypes.DELETE_ERROR    
    }
}

//For signup & login
export const failureReqForSignupLogin = (page) => {
    return {
        type: ActionTypes.FAILURE_REQ_FOR_SIGNUPLOGIN,
        page: page
    }
}

///For signup
export const sendingReqForSignup = () => {
    return {
        type: ActionTypes.SENDING_REQ_FOR_SIGNUP
    }
}

export const successReqForSignup = () => {
    return {
        type: ActionTypes.SUCCESS_REQ_FOR_SIGNUP,
    }
}



//user: {username, pw, email}
export const asyncSignup = (user) => {
    return function (dispatch, getState) {
        dispatch(sendingReqForSignup())
        let hashedPassword = sha256(user.password)
        
        let headers = new Headers({
            "Content-Type": "application/json"
        })
        let body = JSON.stringify({
            username: user.username,
            password: hashedPassword,
            email: user.email,
            userType: user.userType === 'student'? 0 : 1
        })
        let options = {
            method: 'POST',
            headers: headers,
            body: body
        }

        fetch('http://localhost:8080/auth/signup', options)
        .then(res => {
            return res.json()
        })
        .then(resObj => { 
            
            if(resObj.error === false) {
                dispatch(successReqForSignup())                
            }else{
                dispatch(failureReqForSignupLogin('signup'))
                dispatch(addError(resObj.message, resObj.code ))                
            }
            
        })
        .catch(err => {
            dispatch(failureReqForSignupLogin('signup'))     
            dispatch(addError( err.code == null ? err.message: err.code, "Net"))
        })
    }       
}


//For login
export const logout = () => ({
    type: ActionTypes.LOGOUT
})
export const sendingReqForLogin = (user) => {
    return {
        type: ActionTypes.SENDING_REQ_FOR_LOGIN,
        username: user.username,
        password: user.password
    }
}


export const successReqForLogin = (tokensNuserType) => {
    return {
        type: ActionTypes.SUCCESS_REQ_FOR_LOGIN,
        accessToken: tokensNuserType['access_token'],
        expires: tokensNuserType['expires_in'],
        refreshToken: tokensNuserType['refresh_token'],
        userType: tokensNuserType['user_type']
    }

}

export const asyncLogin = (username, password) => {
    return function (dispatch, getState) {
        console.log('pw:', password);
        
        let hashedPassword = sha256(password)
        console.log('hashedpw: ', hashedPassword);
        
        let base64 = new Buffer("client:secret").toString('base64')
        let headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
        })
        
        let options = {
            method: 'POST',
            headers: headers,
            body: `grant_type=password&username=${username}&password=${hashedPassword}&client_id=client&client_secret=secret`
        }
        fetch('http://localhost:8080/auth/login', options)
        .then(res => {
            return res.json()
        })
        .then(tokensNuserType => {
            if(tokensNuserType.error == null){
                dispatch(successReqForLogin(tokensNuserType))
            }else{
                dispatch(failureReqForSignupLogin('login'))
                dispatch(addError(tokensNuserType.message, tokensNuserType.code))
            }
        })
        .catch(err=>{
            dispatch(failureReqForSignupLogin('login'))     
            dispatch(addError(err.message, "Net1"))
        })
    }
}

////Profile page
export const fetchingProfile = () => ({
    type: ActionTypes.FETCH_PROFILE
})

export const successGetProfile = (profile, hasNewMsg) => ({

    type: ActionTypes.SUCCESS_GET_PROFILE,
    profile: profile,
    hasNewMsg: hasNewMsg
})



export const asyncGetProfile =  () => {
    return (dispatch, getState) => {
        dispatch(fetchingProfile())

        //Chk 
        //i) if the session was expired=> session ends
        //which token is left 
        //ii) access tok & ref tok => protected src req
        //iii) only ref => refresh tok grant

        let accessToken = storage.getItem('access_token') 
        let refreshToken = storage.getItem('refresh_token') 
        
        if(accessToken == null && refreshToken == null){
            dispatch(addError('Invalid token: Refresh token was expired', 403))
        }else {
            setTimeout( ()=> {
                authAxios({
                    url: 'http://localhost:8080/user/profile/show',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, dispatch, successGetProfile, ['profile'])
            }, 100)
                
        }
 
    }
}

export const successEditProfile = ( photo, hasNewMsg, newProfile) => {
    newProfile.photo = photo
    return {
        type: ActionTypes.SUCCESS_EDIT_PROFILE,
        hasNewMsg: hasNewMsg,
        newProfile: newProfile    
    }
}

export const resetEditSuccess = () => ({
    type: ActionTypes.RESET_EDIT_SUCCESS
})


export const asyncEditProfile = (newProfile) => {
    
    return (dispatch, getState) => {
        let body = new FormData()
        body.append('photo', newProfile.photo)
        body.append('newProfile', JSON.stringify(newProfile))
        //newProfile.photo is a file object 
        //Get the filename from the server and send it to the store
        delete newProfile.photo
        authAxios({ 
            url: 'http://localhost:8080/user/profile/edit',
            method: 'POST',
            headers: {'Content-Type':'multipart/form-data; boundary=Uee--r1_eDOWu7FpA0LJdLwCMLJQapQGu'},
            data: body
        }, dispatch, successEditProfile, ['photo'], [newProfile])
    }
}


export const successRegisterCourse = (registeredCourse, hasNewMsg) => ({
    type: ActionTypes.SUCCESS_REGISTER_COURSE,
    hasNewMsg: hasNewMsg,
    registeredCourse: registeredCourse
})

export const resetRegisterCourseSuccess = () => {
    
    return {
        type: ActionTypes.RESET_REGISTER_COURSE_SUCCESS
    }
}   

export const asyncRegisterCourse = (course) => {
    
    return (dispatch, getState) => {
        
        authAxios({
            method:'POST',
            url: 'http://localhost:8080/courses/register',
            headers: { 'Content-Type': 'application/json'},
            data: {
                course: course
            }
        }, dispatch, successRegisterCourse, ['registeredCourse'] )
    }
}

export const successAddReview = (hasNewMsg) => ({
    type: ActionTypes.SUCCESS_ADD_REVIEW,
    hasNewMsg: hasNewMsg
})

export const resetAddReviewSuccess = () => ({
    type: ActionTypes.RESET_ADD_REVIEW_SUCCESS
})

export const asyncAddReview = (review) => {
    return  (dispatch, getState) => {

        authAxios({
            method: 'POST',
            url: `http://localhost:8080/user/review`,
            headers: { 'Content-Type': 'application/json'},
            data: review
        }, dispatch, successAddReview)
    }
}

export const successReserveLesson = (hasNewMsg) => ({
    type: ActionTypes.SUCCESS_RESERVE_LESSON,
    hasNewMsg: hasNewMsg
})

export const resetReserveLessonSuccess = () => ({
    type: ActionTypes.RESET_RESERVE_LESSON_SUCCESS
})

export const asyncReserveLesson = (lesson) => {
    return (dispatch, getState) => {
        authAxios({
            url: `http://localhost:8080/courses/reserve`,
            headers: {'Content-Type': 'application/json'},
            method:'POST',
            data: lesson
        }, dispatch, successReserveLesson)
    }
}


// for "MsgBox" page

export const successGetMsgs = ( msgs, hasNewMsg) => ({
    type: ActionTypes.SUCCESS_GET_MSGS,
    msgs: msgs,
    hasNewMsg: hasNewMsg   
})





export const asyncGetMsgs = () => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/msgs/get',
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            data: {}
        }, dispatch, successGetMsgs, ['msgs'])
    }
}

//For MsgBox 
export const successSetRead = (hasNewMsg, msgID ) => ({
    type: ActionTypes.SUCCESS_SET_READ,
    hasNewMsg: hasNewMsg,
    ID: msgID
})




export const asyncSetRead = (msgID, type, lessonID = null) => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/msgs/read',
            headers: {'Content-Type': 'application/json'},
            method:'POST',
            data: { ID : msgID, type: type, lessonID: lessonID }
        }, dispatch, successSetRead, [], [msgID])
    }
}     

//For MsgBox
export const successSendMsg = (hasNewMsg) => ({
    type: ActionTypes.SUCCESS_SEND_MSG,
    hasNewMsg: hasNewMsg
})

export const resetSendMsgSuccess = () => ({
    type: ActionTypes.RESET_SEND_MSG_SUCCESS
})

export const asyncSendMsg = (to, content) => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/msgs/send',
            method: 'POST',
            data: {
                to: to,
                content: content
            }
        }, dispatch, successSendMsg)
    }

}


//For MyCourses
export const successGetMyCourses = (courses, hasNewMsg) => ({
    type: ActionTypes.SUCCESS_GET_MY_COURSES,
    courses: courses,
    hasNewMsg: hasNewMsg
})


export const aysncGetMyCourses = (userType) => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/courses/mycourses',
            method: 'POST',
            data: { userType: userType}
        }, dispatch, successGetMyCourses, ['courses'])
    }
}


//For MySchedule
export const successGetMySchedule = (infoForCals, hasNewMsg) => ({
    type: ActionTypes.SUCCESS_GET_MY_SCHEDULE,
    infoForCals: infoForCals,
    hasNewMsg: hasNewMsg
})


export const aysncGetMySchedule = (userType, utcOffset) => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/courses/schedule',
            method: 'POST',
            data: { userType: userType, utcOffset: new Date().getTimezoneOffset()}
        }, dispatch, successGetMySchedule, ['infoForCals'])
    }
}



// For MyTeachers
export const successGetMyTeachers = (myTeachers, hasNewMsg) =>({
    type: ActionTypes.SUCCESS_GET_MY_TEACHERS,
    hasNewMsg: hasNewMsg,
    myTeachers: myTeachers
})

export const asyncGetMyTeachers = () => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/user/myteachers',
            method: 'POST'
        }, dispatch, successGetMyTeachers, ['myTeachers'])
    }
}


// For MyStudents 
export const successGetMyStudents = (myStudents, hasNewMsg) =>({
    type: ActionTypes.SUCCESS_GET_MY_STUDENTS,
    hasNewMsg: hasNewMsg,
    myStudents: myStudents
})

export const asyncGetMyStudents = () => {
    return (dispatch, getState) => {
        authAxios({
            url: 'http://localhost:8080/user/mystudents',
            method: 'POST'
        }, dispatch, successGetMyStudents, ['myStudents'])
    }
}


export const successEditAccount = (hasNewMsg) => ({
    type: ActionTypes.SUCCESS_EDIT_ACCOUNT,
    hasNewMsg: hasNewMsg
})

export const resetEditAccountSuccess = ()=> ({
    type: ActionTypes.RESET_EDIT_ACCOUNT_SUCCESS
})

export const asyncEditAccount = (email, oldPw, newPw) => {
    return (dispatch, getState) => {
        console.log('asyncEditAccount() email:', email, 'oldpw:', oldPw, 'newPw:', newPw);
        
        authAxios({
            url: 'http://localhost:8080/user/account/edit',
            method: 'POST',
            data: {
                email: email == null|| email === ''? null: email,
                oldPw: oldPw == null|| oldPw === '' ? null: sha256(oldPw),
                newPw: newPw == null|| newPw === '' ? null: sha256(newPw)
            }
        }, dispatch, successEditAccount)
    }
}

export const successGetAccount = ( account, hasNewMsg) => ({
    type : ActionTypes.SUCCESS_GET_ACCOUNT,
    account: account,
    hasNewMsg: hasNewMsg
})


export const asyncGetAccount = (email, oldPw, newPw) => {
    return (dispatch, getState) => {

        authAxios({
            url: 'http://localhost:8080/user/account/get',
            method: 'POST'
        }, dispatch, successGetAccount, ['account'])
    }
}

export const successGetStatics = (statics, hasNewMsg) => ({
    type: ActionTypes.SUCCESS_GET_STATICS,
    statics: statics,
    hasNewMsg: hasNewMsg
})

export const asyncGetStatics = () => {
    return (dispatch, getState ) => {
        authAxios({
            url: 'http://localhost:8080/statics',
            method: 'POST',
            data: { utcOffset: new Date().getTimezoneOffset()}
        }, dispatch, successGetStatics, ['statics'])
    } 
}
