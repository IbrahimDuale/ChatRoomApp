import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, signInAnonymously } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvtrVgpTe9uNtZLdGjGaHHOoeAx_U0b1c",
    authDomain: "chat-message-app-e1409.firebaseapp.com",
    databaseURL: "https://chat-message-app-e1409-default-rtdb.firebaseio.com",
    projectId: "chat-message-app-e1409",
    storageBucket: "chat-message-app-e1409.appspot.com",
    messagingSenderId: "105053602961",
    appId: "1:105053602961:web:8eb3f71dabb66087e8ab30",
    measurementId: "G-8VNKYC2V21"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signInAnonymously(auth)
    .then((auth) => {
        // Signed in..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });

const db = getFirestore(app);
const realtimeDb = getDatabase();
const functions = getFunctions(getApp());

connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, "http://localhost:9099");
connectDatabaseEmulator(realtimeDb, "localhost", 9000);
connectFunctionsEmulator(functions, "localhost", 5001);

const admin_id = -1;
const MESSAGES_COLLECTION = "messages";
const ROOM_NAMES_COLLECTION = "room_names"
const MEMBERS_COLLECTION = "room_members";


// Initialize Firebase
export { db, auth, admin_id, MESSAGES_COLLECTION, ROOM_NAMES_COLLECTION, MEMBERS_COLLECTION, realtimeDb };