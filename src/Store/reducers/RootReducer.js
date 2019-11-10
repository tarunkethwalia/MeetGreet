import {combineReducers} from 'redux';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    root : userReducer
});

export default rootReducer;