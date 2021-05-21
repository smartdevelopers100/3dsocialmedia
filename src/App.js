import React, {useEffect} from 'react';
import './App.css';
import {Provider} from 'react-redux'; 
import {BrowserRouter} from 'react-router-dom';
import store from './store';
import {auth} from './firebase';
import { useSelector, useDispatch} from 'react-redux';
import SplashScreen from './components/SplashScreen';
import * as authActionTypes from './action_types/auth';

const Auth = React.lazy(() => import('./Auth'));
const Dashboard = React.lazy(() => import('./Dashboard'));

const ClassesApp = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch(); 

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
        if(user)
        {
          dispatch({
            type: authActionTypes.LOGIN_SUCCESS,
            payload: {
              uid: user.uid, 
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            }
          });
        }
        else
        {
          dispatch({
            type: authActionTypes.LOGOUT_SUCCESS,
          });
        }
    });

    return unsubscribe;

  }, []);

  if(user.isAuthenticated === null)
  {
    return (<SplashScreen />);
  }   

  return user.isAuthenticated ? <Dashboard /> : <Auth />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={<SplashScreen />}>
          <ClassesApp />
        </React.Suspense>
      </BrowserRouter> 
    </Provider>
  );
}

export default App;


