import { combineReducers, createStore, applyMiddleware } from 'redux';
// import topBar from './Reducers/topBar';
import thunk from 'redux-thunk';
import user from './Reducers/user';
import msgs from './Reducers/msgs';
import error from './Reducers/error';
import chartCfs from './Reducers/chartCfs';
import logger from './Middlewares/logger';


const rootReducer = combineReducers({user, error, msgs, chartCfs});

export default createStore(rootReducer, applyMiddleware(thunk, logger));