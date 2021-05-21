import React from 'react';
import './Auth.css';
import {useDispatch, useSelector} from 'react-redux';
import * as authActionTypes from './action_types/auth';
import Loading from './components/Loading';
import Error from './components/Error';
import * as settings from './config/settings';

function Auth() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth); 

    const logIn = () => {
        dispatch({
            type: authActionTypes.LOGIN_LOADING
        });

        dispatch({
            type: authActionTypes.LOGIN
        });
    }

    return (
        <div className="auth">
            <div className="sign-in">
                <div className="brand">{settings.APP_NAME}</div>
                <button className="sign-in__btn" onClick={logIn}>Log In</button>
                {auth.logIn.loading && <Loading />}
                {auth.logIn.error && <Error error={auth.logIn.error} />} 
            </div>
        </div>
    );
}

export default Auth;
