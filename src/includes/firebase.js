import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC_mJvjj1cqfHM6d6UEAqr--By6WvWZZJE",
    authDomain: "mega-music-46b8c.firebaseapp.com",
    projectId: "mega-music-46b8c",
    storageBucket: "mega-music-46b8c.appspot.com",
    appId: "1:213788783484:web:0b08457bcd6f994141eaf9"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.firestore();

//collections
const usersCollection = database.collection('users');

export {
    auth,
    database,
    usersCollection
}