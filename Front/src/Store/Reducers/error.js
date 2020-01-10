import * as ActionTypes from '../../Actions/ActionTypes'

const initialState = {
    code: null,
    message: null,
    timestamp: null
}



const error = (state = initialState , action) => {
    switch(action.type){
        case ActionTypes.ADD_ERROR:

            return Object.assign({}, state, {
                code : action.code,
                timestamp : Date.now(),          
                message : action.message
            })
        
        case ActionTypes.DELETE_ERROR:

            return Object.assign({}, state, {
                code:  null,
                message : null,
                timestamp : null
            })

        default :
            return state
    }
}

export default error;