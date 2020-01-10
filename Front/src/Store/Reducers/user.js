import * as ActionTypes from '../../Actions/ActionTypes';
import ExpiredStorage from 'expired-storage';
import { getLastDate, getFirstDay} from '../../Utils/dateFunctions';


const initialState = {
    signupSuccess: false,
    loginSuccess: false,
    editSuccess: false,
    addReviewSuccess: false, 
    registerCourseSuccess: false,
    reserveLessonSuccess: false,
    editAccountSuccess: false,
    shouldUpdateProfile: false,
    profile: null,
    sending: false,
    fetching: false,
    hasNewMsg: {val: false, ts: 0 },
    courses: [],
    lessons: null,
    infoForCals: null,
    account: null
}

let expiredStorage = new ExpiredStorage()


const user = (state = initialState, action) => {
    
    switch(action.type){
        
        case ActionTypes.SENDING_REQ_FOR_SIGNUP:
            return Object.assign({}, state, {
                sending: true
            })
            

        case ActionTypes.FAILURE_REQ_FOR_SIGNUPLOGIN:
            let key; 
            if(action.page === 'signup') key = 'signupSuccess'
            else key= 'loginSuccess'
 
            return Object.assign({}, state, {
                sending: false,
                [key]: false
            }) 
            

        case ActionTypes.SUCCESS_REQ_FOR_SIGNUP:
            return Object.assign({}, state, {
                sending : false,
                signupSuccess : true
            }) 
            

        case ActionTypes.LOGOUT:
            return Object.assign({}, state, {
                ... initialState
            })
            

        case ActionTypes.SUCCESS_REQ_FOR_LOGIN:

            //Store tokens
            expiredStorage.setItem('access_token', action.accessToken, action.expires) 
            expiredStorage.setItem('refresh_token', action.refreshToken)      
            expiredStorage.setItem('userType', action.userType)      
            return Object.assign({}, state, {
                sending: false,
                loginSuccess: true
            }) 
            

        case ActionTypes.FETCH_PROFILE:
            return Object.assign({}, state, {
                fetching: true
            }) 
            

        case ActionTypes.FAILURE_GET_PROFILE:
            return Object.assign({}, state, {
                fetching: false
            }) 
            
        
        case ActionTypes.SUCCESS_GET_PROFILE:

            return Object.assign({}, state, {
                fetching: false,
                profile : action.profile,
                shouldUpdateProfile : false,
                hasNewMsg: {... getValTsFromHasNewMsg(action.hasNewMsg)}
            })       
            
                 
            
        case ActionTypes.SUCCESS_EDIT_PROFILE:
        
            return Object.assign({}, state, {
                editSuccess : true,
                shouldUpdateProfile :true,
                profile: {...state.profile, ...action.newProfile},
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            })   
                                 
            
        case ActionTypes.RESET_EDIT_SUCCESS:
            return Object.assign({}, state, {
                editSuccess: false
            }) 
            
            
            
        case ActionTypes.SUCCESS_REGISTER_COURSE:
        console.log('profile:', state.profile);

            if(state.profile == null)  {
                return Object.assign({}, state , {
                    registerCourseSuccess : true,
                    shouldUpdateProfile : true,
                    profile: { courses: [action.registerCourseSuccess]},
                    hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
                }) 
            }else{
                let newCourses =
                state.profile.courses == null ? []:
                state.profile.courses.concat(action.registeredCourse) 
                
                return Object.assign({}, state , {
                    registerCourseSuccess : true,
                    shouldUpdateProfile : true,
                    profile: {...state.profile, courses: [...newCourses]},
                    hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
                }) 
            }
            
            

        case ActionTypes.RESET_REGISTER_COURSE_SUCCESS:
            
            return Object.assign({}, state, {
                registerCourseSuccess : false
            }) 
            
            
        case ActionTypes.SUCCESS_ADD_REVIEW:

            return Object.assign({}, state, {
                addReviewSuccess : true,
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}              
            }) 
            

        case ActionTypes.RESET_ADD_REVIEW_SUCCESS:
            
            return Object.assign({}, state, {
                addReviewSuccess : false
            }) 
            

        case ActionTypes.SUCCESS_RESERVE_LESSON:
            
            
            return Object.assign({}, state, {
                reserveLessonSuccess : true,
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}             
            }) 
            

        case ActionTypes.RESET_RESERVE_LESSON_SUCCESS:
            return Object.assign({}, state, {
                reserveLessonSuccess : false
            }) 
            
        case ActionTypes.SUCCESS_GET_MY_COURSES:
            return Object.assign({}, state, {
                courses : action.courses,
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 
            
        case ActionTypes.SUCCESS_GET_MY_SCHEDULE:

            return Object.assign({}, state, {
                infoForCals: [...action.infoForCals],
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 

        case ActionTypes.SUCCESS_GET_MY_STUDENTS:
            let myStudents = action.myStudents == null? []: action.myStudents
            return Object.assign({}, state, {
                myStudents: [...myStudents],
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 

        case ActionTypes.SUCCESS_GET_MY_TEACHERS:
            return Object.assign({}, state, {
                myTeachers: [...action.myTeachers],
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 

        case ActionTypes.SUCCESS_GET_ACCOUNT:
            return Object.assign({}, state, {
                account: action.account,
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 

        case ActionTypes.SUCCESS_EDIT_ACCOUNT:
            return Object.assign({}, state, {
                editAccountSuccess: true,
                hasNewMsg: {...getValTsFromHasNewMsg(action.hasNewMsg)}
            }) 
  
        case ActionTypes.RESET_EDIT_ACCOUNT_SUCCESS:
            return Object.assign({}, state, {
                editAccountSuccess: false
            }) 

        
        default:
            return state 
    }
} 

const getValTsFromHasNewMsg = (str) => {
    let valNts = str.split('_')
    let val = valNts[0] ==='true'? true: false
    return {
        val: val,
        ts: parseInt(valNts[1])
    }
}

export default user;

