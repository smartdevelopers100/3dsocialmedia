import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers/root';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './effects/root';
import authInitialState from './initial_states/auth';
import filesInitialState from './initial_states/files';
import postsInitialState from './initial_states/posts';

const initialState = {
    auth: authInitialState,
    files: filesInitialState,
    posts: postsInitialState
};

const epicMiddleware = createEpicMiddleware(); 
const store = createStore(rootReducer, initialState, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic)

export default store;