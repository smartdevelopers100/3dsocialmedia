import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkBob2NsUdJeN62d0ZEvyGOMw-W_0cB2o",
  authDomain: "dsocialmedia-prod.firebaseapp.com",
  projectId: "dsocialmedia-prod",
  storageBucket: "dsocialmedia-prod.appspot.com",
  messagingSenderId: "861628348505",
  appId: "1:861628348505:web:ba55e5a547ca6115c65948",
  measurementId: "G-SH1YJ0MD6S"
};

firebase.initializeApp(firebaseConfig); 

export const auth = firebase.auth(); 
export const db = firebase.firestore();
export const storage = firebase.storage(); 
export const storageRef = storage.ref(); 
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const FieldValue = firebase.firestore.FieldValue;

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export default firebase;