import * as actionTypes from '../action_types/auth';
import { ofType } from 'redux-observable';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {auth, googleAuthProvider} from '../firebase';
import {db} from '../firebase';

export const logInEpic = (action$, state$) => {
    return action$.pipe(
            ofType(actionTypes.LOGIN),
            switchMap(action => {
                return new Observable(async observer => {
                    try 
                    {
                        const userCredential = await auth.signInWithPopup(googleAuthProvider);
                        const {user} = userCredential; 
                        const doc = await db.collection('users').doc(user.uid).get();
                        if(!doc.exists)
                        {
                            await doc.ref.set({
                                displayName: user.displayName,
                                photoURL: user.photoURL
                            });
                        }
                        observer.next({
                            type: actionTypes.LOGIN_SUCCESS,
                            payload: {
                                uid: user.uid,
                                email: user.email,
                                displayName: user.displayName,
                                photoURL: user.photoURL
                            }
                        });
                    }
                    catch(err)
                    {
                        observer.next({
                            type: actionTypes.LOGIN_ERROR,
                            payload: err.message
                        });
                    }
                });

            })
        );
}

export const logOutEpic = (action$, state$) => {
    return action$.pipe(
        ofType(actionTypes.LOGOUT),
        switchMap(action => {
            return new Observable(async observer => {
                try
                {
                    await auth.signOut();
                    observer.next({
                        type: actionTypes.LOGOUT_SUCCESS
                    });
                }
                catch(err)
                {
                    observer.next({
                        type: actionTypes.LOGOUT_ERROR,
                        payload: err.message
                    });
                }
            });
        })
    );
}
