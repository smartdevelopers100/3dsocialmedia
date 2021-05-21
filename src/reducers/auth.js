import initialState from '../initial_states/auth';
import * as actionTypes from '../action_types/auth';

function reducer(state=initialState, action) 
{
    switch(action.type)
    {
        case actionTypes.SET_AUTH_INITIAL_STATE:
            return initialState;
        case actionTypes.LOGIN_LOADING:
            return ({
                ...state,
                logIn: {
                    loading: true,
                    success: false,
                    error: null
                }
            });
        case actionTypes.LOGIN_SUCCESS:
            return ({
                ...state,
                user: {
                    isAuthenticated: true,
                    ...action.payload
                },
                logIn: {
                    loading: false,
                    sucess: true,
                    error: null
                }
            });
        case actionTypes.LOGIN_ERROR:
            return ({
                ...state,
                logIn: {
                    loading: false,
                    sucess: false,
                    error: action.payload
                }
            });
        case actionTypes.LOGOUT_LOADING:
            return ({
                ...state,
                logOut: {
                    loading: true,
                    success: false,
                    error: null
                }
            });
        case actionTypes.LOGOUT_SUCCESS:
            return ({
                ...state,
                user: {
                    isAuthenticated: false
                },
                logOut: {
                    loading: false,
                    success: true,
                    error: null
                }
            });
        case actionTypes.LOGOUT_ERROR:
            return ({
                ...state,
                logOut: {
                    loading: false,
                    success: false,
                    error: action.payload
                }
            });
        default:
            return state;
    }
}

export default reducer;