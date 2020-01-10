import * as ActionTypes from '../../Actions/ActionTypes';
import ExpiredStorage from 'expired-storage';

const storage = new ExpiredStorage()
const intailState = {
    msgs: [],
    successSendMsg: false,
    hasNewMsg: {val: false, ts: 0}
}

const msgs = (state = intailState, action) => {
    let newHasNewMsg;
    switch(action.type){
        case ActionTypes.SUCCESS_GET_MSGS:

            return Object.assign({}, state, {
                msgs: [...action.msgs],
                hasNewMsg: getValTsFromHasNewMsg(action.hasNewMsg)                          
            }) 



        case ActionTypes.SUCCESS_SET_READ:
            let  newMsgs  = state.msgs
            newMsgs.every( (msg,idx) => {
                if(msg.ID === action.ID){
                    newMsgs[idx].read = 1
                    
                    return false
                }
                else return true
            })


            return Object.assign({}, state, {
                msgs: [...newMsgs],
                hasNewMsg: getValTsFromHasNewMsg(action.hasNewMsg)
            })            
            
        case ActionTypes.SUCCESS_SEND_MSG:
            
            return Object.assign({}, state, {
                successSendMsg: true,
                hasNewMsg: getValTsFromHasNewMsg(action.hasNewMsg)                
            })   

        case ActionTypes.RESET_SEND_MSG_SUCCESS:
            
            return Object.assign({}, state, {
                successSendMsg: false,
            }) 
        
        default:
            return state 
    }
}


const getValTsFromHasNewMsg = (str) => {
    let valNts = str.split('_')
    let val = valNts[0] === 'true'? true: false
    return {
        val: val,
        ts: parseInt(valNts[1])
    }
}


export default msgs;
