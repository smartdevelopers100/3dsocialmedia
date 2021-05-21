import * as actionTypes from '../action_types/files';
import {ofType} from 'redux-observable';
import {mergeMap, takeUntil, map} from 'rxjs/operators'; 
import {Observable} from 'rxjs';
import firebase, {storage, storageRef} from '../firebase';

let uploadsData = [];

export const uploadFilesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.UPLOAD_FILES),
        mergeMap(action => {
            const {parentPath, filesData} = action.payload; 
            return new Observable(observer => {
                filesData.forEach(({file, uuid}) => {
                    const path = `${parentPath}/${uuid}.${file.name}`;
                    const uploadTask = storageRef.child(path).put(file);
                    uploadsData.push({
                        uuid,
                        uploadTask
                    });
                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
                            const percentage = Math.floor(snapshot.bytesTransferred * 100 / snapshot.totalBytes); 
                            observer.next({
                                type: actionTypes.UPLOAD_FILES_PROGRESS,
                                payload: {
                                    uuid,
                                    progress: {
                                        percentage
                                    }
                                }
                            });
                        }, err => {
                            if(err.code !== 'storage/canceled')
                            {
                                observer.next({
                                    type: actionTypes.UPLOAD_FILES_ERROR,
                                    payload: {
                                        uuid,
                                        error: `${file.name} uploading error: ${err.message}.`
                                    }
                                });
                            }
                        }, async () => {
                            uploadsData = uploadsData.filter(uploadData => uploadData.uuid !== file.uuid);
                            try 
                            {
                                const url =  await uploadTask.snapshot.ref.getDownloadURL();
                                observer.next({
                                    type: actionTypes.UPLOAD_FILES_SUCCESS,
                                    payload: {
                                        uuid,
                                        success: `${file.name} is uploaded successfully.`,
                                        data: {
                                            name: file.name,
                                            type: file.type,
                                            size: file.size,
                                            url
                                        }
                                    }
                                });
                            }
                            catch(err)
                            {
                                observer.next({
                                    type: actionTypes.UPLOAD_FILES_ERROR,
                                    payload: {
                                        uuid,
                                        error: `${file.name} uploading error: ${err.message}.`
                                    }
                                });
                            }
                        });
                    })
            }).pipe(
                takeUntil(
                    action$.pipe(
                        ofType(
                                actionTypes.SET_FILES_INITIAL_STATE,
                                actionTypes.SET_UPLOAD_FILES_INITIAL_STATE
                            ),
                        map(action => {
                            uploadsData.forEach(({uploadTask}) => {
                                uploadTask.cancel();
                            });
                            uploadsData = [];
                            return action;
                        })
                    )
                )
            );
        })
    );
}

export const uploadFilesPauseEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.UPLOAD_FILES_PAUSE),
        mergeMap(action => {
            return new Observable(observer => {
                const {uuid} = action.payload;
                const uploadData = uploadsData.find(uploadData => uploadData.uuid === uuid);
                if(uploadData)
                {
                    const {uploadTask} = uploadData;
                    uploadTask.pause();
                    observer.next({
                        type: actionTypes.SET_UPLOAD_FILES_PAUSE,
                        payload: {uuid}
                    });
                }
            });
        })
    );
}

export const uploadFilesResumeEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.UPLOAD_FILES_RESUME),
        mergeMap(action => {
            return new Observable(observer => {
                const {uuid} = action.payload;
                const uploadData = uploadsData.find(uploadData => uploadData.uuid === uuid);
                if(uploadData)
                {
                    const {uploadTask} = uploadData;
                    uploadTask.resume();
                    observer.next({
                        type: actionTypes.SET_UPLOAD_FILES_RESUME,
                        payload: {
                            uuid
                        }
                    });
                }
            });
        })
    );
}

export const uploadFilesCancelEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.UPLOAD_FILES_CANCEL),
        mergeMap(action => {
            return new Observable(observer => {
                const {uuid} = action.payload;
                const uploadData = uploadsData.find(uploadData => uploadData.uuid === uuid);
                if(uploadData)
                {
                    const {uploadTask} = uploadData;
                    uploadTask.cancel();
                    uploadsData = uploadsData.filter(uploadData => uploadData.uuid !== uuid);
                }
            });
        })
    );
}

export const deleteFilesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.DELETE_FILES),
        mergeMap(action => {
            const files = action.payload;
                return new Observable(async observer => {
                    files.forEach(async file => {   
                        try 
                        {    
                            await storage.refFromURL(file.url).delete();
                            observer.next({
                                type: actionTypes.DELETE_FILES_SUCCESS,
                                payload: {
                                    id: file.id,
                                    success: `${file.name} is deleted successfully.`
                                }
                            });
                        }
                        catch(err)
                        {
                            observer.next({
                                type: actionTypes.DELETE_FILES_ERROR,
                                payload: {
                                    id: file.id,
                                    error: `${file.name} deleteing error: ${err.message}.`
                                }
                            });
                        }
                    });
                }).pipe(
                    takeUntil(
                        action$.pipe(
                            ofType(
                                actionTypes.SET_FILES_INITIAL_STATE, 
                                actionTypes.SET_DELETE_FILES_INITIAL_STATE
                            )
                        )
                    )
                );
        })
    );
}