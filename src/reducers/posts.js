import initialState from '../initial_states/posts';
import * as actionTypes from '../action_types/posts';

function reducer(state=initialState, action)
{
    switch(action.type)
    {
        case actionTypes.SET_POSTS_INITIAL_STATE:
            return initialState;
        
        case actionTypes.CREATE_POST_LOADING:
            return ({
                ...state,
                create: {
                    loading: true
                }
            });
        case actionTypes.CREATE_POST_SUCCESS:
            return ({
                ...state,
                data: [action.payload, ...state.data],
                create: {
                    success: true
                }
            });
        case actionTypes.CREATE_POST_ERROR:
            return ({
                ...state,
                create: {
                    error: action.payload
                }
            });
        case actionTypes.SET_CREATE_POST_INITIAL_STATE:
            return ({
                ...state,
                create: {}
            });

        case actionTypes.LIST_POSTS_LOADING:
            return ({
                ...state,
                list: {
                    loading: true
                }
            });        
        case actionTypes.LIST_POSTS_SUCCESS:
            return ({
                ...state,
                data: [...state.data, ...action.payload],
                list: {
                    success: true
                }
            });
        case actionTypes.LIST_POSTS_ERROR:
            return ({
                ...state,
                list: {
                    error: action.payload
                }
            });
        case actionTypes.SET_LIST_POSTS_INITIAL_STATE:
            return ({
                ...state,
                list: {}
            });
        
        case actionTypes.GET_POST_LOADING:
            return ({
                ...state,
                get: {
                    loading: true
                }
            });
        case actionTypes.GET_POST_SUCCESS:
            return ({
                ...state,
                get: {
                    data: action.payload,
                    success: true
                }
            });
        case actionTypes.GET_POST_ERROR:
            return ({
                ...state,
                get: {
                    error: action.payload
                }
            });
        case actionTypes.GET_POST_REDIRECT:
            return ({
                ...state,
                get: {
                    redirect: true
                }
            });
        case actionTypes.SET_GET_POST_INITIAL_STATE:
            return ({
                ...state,
                get: {}
            });
        
        case actionTypes.SET_EDIT_POST_DATA:
            return ({
                ...state,
                edit: {
                    data: action.payload
                }
            });
        case actionTypes.EDIT_POST_LOADING:
            return ({
                ...state,
                edit: {
                    data: state.edit.data,
                    loading: true
                }
            });
        case actionTypes.EDIT_POST_SUCCESS:
            if(state.get.data && state.get.data.id === action.payload.id)
            {
                return ({
                    ...state,
                    data: state.data.map(post => {
                        if(post.id === action.payload.id)
                        {
                            return action.payload;
                        }
                        return post;
                    }),
                    get: {
                        ...state.get,
                        data: action.payload
                    },
                    edit: {
                        success: true
                    }
                });
            }
            return ({
                ...state,
                data: state.data.map(post => {
                    if(post.id === action.payload.id)
                    {
                        return action.payload;
                    }
                    return post;
                }),
                edit: {
                    success: true
                }
            });
        case actionTypes.EDIT_POST_ERROR:
            return ({
                ...state,
                edit: {
                    data: state.edit.data,
                    error: action.payload
                }
            });
        case actionTypes.SET_EDIT_POST_INITIAL_STATE:
            return ({
                ...state,
                edit: {}
            });
        
        case actionTypes.SET_DELETE_POST_DATA:
            return ({
                ...state,
                delete: {
                    data: action.payload
                }
            });
        case actionTypes.DELETE_POST_LOADING:
            return ({
                ...state,
                delete: {
                    data: state.delete.data,
                    loading: true
                }
            });
        case actionTypes.DELETE_POST_SUCCESS:
            return ({
                ...state,
                data: state.data.filter(post => post.id !== action.payload.id),
                delete: {
                    data: state.delete.data,
                    success: true
                }
            });
        case actionTypes.DELETE_POST_ERROR:
            return ({
                ...state,
                delete: {
                    data: state.delete.data,
                    error: action.payload
                }
            });
        case actionTypes.SET_DELETE_POST_INITIAL_STATE:
            return ({
                ...state,
                delete: {}
            });
        case actionTypes.SET_POST_USER:
            if(state.get.data && state.get.data.user.uid === action.payload.uid)
            {
                return ({
                    ...state,
                    data: state.data.map(post => {
                        if(post.user.uid === action.payload.uid)
                        {
                            return ({
                               ...post,
                               user: action.payload 
                            });
                        }
                        return post;
                    }),
                    get: {
                        ...state.get,
                        data: {
                            ...state.get.data,
                            user: action.payload
                        }
                    }
                });                
            }

            return ({
                ...state,
                data: state.data.map(post => {
                    if(post.user.uid === action.payload.uid)
                    {
                        return ({
                           ...post,
                           user: action.payload 
                        });
                    }
                    return post;
                })
            });
        default:
            return state;
    }
}

export default reducer;