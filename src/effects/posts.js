import {ofType} from 'redux-observable';
import * as actionTypes from '../action_types/posts';
import {mergeMap, switchMap, mapTo} from 'rxjs/operators';
import {db} from '../firebase';
import {Observable} from 'rxjs';
import * as filesActionTypes from '../action_types/files';

export const cancelFilesUploadingEpic = (action$, state$) => {
    return action$.pipe(
        ofType(
                actionTypes.SET_POSTS_INITIAL_STATE, 
                actionTypes.SET_CREATE_POST_INITIAL_STATE,
                actionTypes.SET_EDIT_POST_INITIAL_STATE
            ),
        mapTo({
            type: filesActionTypes.SET_UPLOAD_FILES_INITIAL_STATE
        })
    );
} 

export const cancelFilesDeletionEpic = (action$, state$) => {
    return action$.pipe(
        ofType(
                actionTypes.SET_POSTS_INITIAL_STATE,
                actionTypes.SET_EDIT_POST_INITIAL_STATE
            ),
        mapTo({
            type: filesActionTypes.SET_DELETE_FILES_INITIAL_STATE
        })
    );
}

export const createPostEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.CREATE_POST),
        mergeMap(action => {
            const data = action.payload;
            return new Observable(async observer => {
                try
                {
                    const docRef = await db.collection('posts').add(data);
                    const doc = await docRef.get();
                    const post = {
                        id: doc.id,
                        ...doc.data()
                    };

                    post.user = {
                        uid: post.uid
                    };
                    delete post.uid;
                    observer.next({
                        type: actionTypes.GET_POST_USER,
                        payload: post.user.uid
                    });

                    observer.next({
                        type: actionTypes.CREATE_POST_SUCCESS,
                        payload: post
                    });
                }
                catch(err) 
                {
                    observer.next({
                        type: actionTypes.CREATE_POST_ERROR,
                        payload: err.message
                    });
                }
            });
        })
    );
}

export const getPostUserEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.GET_POST_USER),
        mergeMap(action => {
            const uid = action.payload;
            return new Observable(async observer => {
                try
                {
                    const doc = await db.collection('users').doc(uid).get();
                    if(doc.exists)
                    {
                       observer.next({
                           type: actionTypes.SET_POST_USER,
                           payload: {
                               uid,
                               ...doc.data()
                           }
                       });
                    }
                }
                catch(err)
                {}
            });
        })
    );
}

let lastDoc;
export const listPostsEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.LIST_POSTS),
        mergeMap(action => {
            return new Observable(async observer => {
                try
                {
                    if(!lastDoc)
                    {
                        const snapshot = await db.collection('posts')
                                        .orderBy('createdAt', 'desc')
                                        .limit(20)
                                        .get();
     
                        let posts = [];
                        snapshot.docs.forEach(doc => {
                                const post = {
                                    id: doc.id,
                                    ...doc.data()
                                };

                                post.user = {
                                    uid: post.uid
                                };
                                delete post.uid;
                                observer.next({
                                    type: actionTypes.GET_POST_USER,
                                    payload: post.user.uid
                                });

                                posts.push(post);
                        }); 

                        lastDoc = snapshot.docs[snapshot.docs.length - 1];
                        observer.next({
                            type: actionTypes.LIST_POSTS_SUCCESS,
                            payload: posts
                        });
                    }
                    else
                    {
                        const snapshot = await db.collection('posts')
                                            .orderBy('createdAt', 'desc')
                                            .startAfter(lastDoc)
                                            .limit(20)
                                            .get();
                                          
                            const posts = [];
                            snapshot.docs.forEach(doc => {
                                const post = {
                                    id: doc.id,
                                    ...doc.data()
                                };

                                post.user = {
                                    uid: post.uid
                                };
                                delete post.uid;
                                observer.next({
                                    type: actionTypes.GET_POST_USER,
                                    payload: post.user.uid
                                });

                                posts.push(post);
                            });
                            
                            if(!snapshot.empty)
                            {
                                lastDoc = snapshot.docs[snapshot.docs.length - 1];
                            }
                            observer.next({
                                type: actionTypes.LIST_POSTS_SUCCESS,
                                payload: posts
                            });
                    }
                }
                catch(err)
                {
                    observer.next({
                        type: actionTypes.LIST_POSTS_ERROR,
                        payload: err.message
                    });
                }
            })
        })
    );
}

export const getPostEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.GET_POST),
        switchMap(action => {
            const {id} = action.payload;
            return new Observable(async observer => {
                try
                {
                    const doc = await db.collection('posts').doc(id).get();
                    if(doc.exists)
                    {
                        const post = {
                            id: doc.id,
                            ...doc.data()
                        };
                        
                        post.user = {
                            uid: post.uid
                        };
                        delete post.uid;
                        observer.next({
                            type: actionTypes.GET_POST_USER,
                            payload: post.user.uid
                        });
    
                        observer.next({
                            type: actionTypes.GET_POST_SUCCESS,
                            payload: post
                        });
                    }
                    else
                    {
                        observer.next({
                            type: actionTypes.GET_POST_REDIRECT
                        });
                    }
                }
                catch(err)
                {
                    observer.next({
                        type: actionTypes.GET_POST_ERROR,
                        payload: err.message
                    });
                }
            })
        })
    );
}

export const editPostEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.EDIT_POST),
        switchMap(action => {
            const {id, data} = action.payload;
            return new Observable(async observer => {
                try 
                {
                    const docRef = db.collection('posts').doc(id);
                    await docRef.update(data);
                    const doc = await docRef.get();
                    const post = {
                        id: doc.id,
                        ...doc.data()
                    };

                    post.user = {
                        uid: post.uid
                    };
                    delete post.uid;
                    observer.next({
                        type: actionTypes.GET_POST_USER,
                        payload: post.user.uid
                    });

                    observer.next({
                        type: actionTypes.EDIT_POST_SUCCESS,
                        payload: post
                    });
                }
                catch(err)
                {
                    observer.next({
                        type: actionTypes.EDIT_POST_ERROR,
                        payload: err.message
                    });
                }
            });
        })
    );
}

export const deletePostEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.DELETE_POST),
        switchMap(action => {
            const {id} = action.payload;
            return new Observable(async observer => {
                try
                {
                    await db.collection('posts').doc(id).delete();
                    observer.next({
                        type: actionTypes.DELETE_POST_SUCCESS,
                        payload: {
                            id
                        }
                    });
                }
                catch(err)
                {
                    observer.next({
                        type: actionTypes.DELETE_POST_ERROR,
                        payload: err.message
                    });
                }
            });
        })
    );
}
