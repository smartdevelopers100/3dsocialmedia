import { combineReducers } from 'redux';
import authReducer from './auth';
import filesReducer from './files';
import postsReducer from './posts';

const rootReducer = combineReducers({
    auth: authReducer,
    files: filesReducer,
    posts: postsReducer
});

export default rootReducer;