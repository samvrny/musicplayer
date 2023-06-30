import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

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
const storage = firebase.storage();

database.enablePersistence().catch((error) => {
    console.log(`Firebase persistence error ${error.code}`);
});

//collections
const usersCollection = database.collection('users');
const songsCollection = database.collection('songs');
const commentsCollection = database.collection('comments');

export {
    auth,
    database,
    usersCollection,
    storage,
    songsCollection,
    commentsCollection
}