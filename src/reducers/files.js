import initialState from '../initial_states/files';
import * as actionTypes from '../action_types/files';

function reducer(state=initialState, action)
{
    switch(action.type)
    {
        case actionTypes.SET_FILES_INITIAL_STATE:
            return initialState;
        case actionTypes.UPLOAD_FILES_PROGRESS:
            return ({
                ...state,
                upload: {
                    ...state.upload,
                    progresses: {
                        ...state.upload.progresses,
                        [action.payload.uuid]: action.payload.progress
                    },
                }
            });
        case actionTypes.UPLOAD_FILES_SUCCESS:
            return ({
                ...state,
                upload: {
                    ...state.upload,
                    data: {
                        ...state.upload.data,
                        [action.payload.uuid]: action.payload.data
                    },
                    successes: {
                        ...state.upload.successes,
                        [action.payload.uuid]: action.payload.success
                    }
                }
            });
        case actionTypes.UPLOAD_FILES_ERROR:
            return ({
                ...state,
                upload: {
                    ...state.upload,
                    errors: {
                        ...state.upload.errors,
                        [action.payload.uuid]: action.payload.error
                    }
                }
            });
        case actionTypes.SET_UPLOAD_FILES_PAUSE:
            return ({
                ...state,
                upload: {
                    ...state.upload,
                    pauses: {
                        ...state.upload.pauses,
                        [action.payload.uuid]: true
                    }
                }
            });
        case actionTypes.SET_UPLOAD_FILES_RESUME:
            return ({
                ...state,
                upload: {
                    ...state.upload,
                    pauses: {
                        ...state.upload.pauses,
                        [action.payload.uuid]: false
                    }
                }
            });
        case actionTypes.SET_UPLOAD_FILES_INITIAL_STATE:
            return ({
                ...state,
                upload: {}
            });
        
        case actionTypes.LIST_FILES_LOADING: 
            return ({
                ...state,
                list: {
                    loading: true
                }
            });  
        case actionTypes.LIST_FILES_SUCCESS: 
            return ({
                ...state,
                data: action.payload,
                list: {
                    success: true
                }
            });  
        case actionTypes.LIST_FILES_ERROR: 
            return ({
                ...state,
                list: {
                    error: action.payload
                }
            });  
        case actionTypes.SET_LIST_FILES_INITIAL_STATE: 
            return ({
                ...state,
                data: [],
                list: {}
            }); 

        case actionTypes.DELETE_FILES_LOADING:
            return ({
                ...state,
                delete: {
                    ...state.delete,
                    loadings: {
                        ...state.delete.loadings,
                        [action.payload.id]: true 
                    }
                }
            });
        case actionTypes.DELETE_FILES_SUCCESS:
            return ({
                ...state,
                delete: {
                    ...state.delete,
                    data: {
                        ...state.delete.data,
                        [action.payload.id]: true
                    },
                    loadings: {
                        ...state.delete.loadings,
                        [action.payload.id]: false
                    },
                    successes: {
                        ...state.delete.successes,
                        [action.payload.id]: action.payload.success
                    }
                }
            });
        case actionTypes.DELETE_FILES_ERROR:
            return ({
                ...state,
                delete: {
                    ...state.delete,
                    loadings: {
                        ...state.delete.loadings,
                        [action.payload.id]: false
                    },
                    errors: {
                        ...state.delete.errors,
                        [action.payload.id]: action.payload.error
                    }
                }
            });
        case actionTypes.SET_DELETE_FILES_INITIAL_STATE:
            return ({
                ...state,
                delete: {}
            });
        default:
            return state;
    }
}

export default reducer;