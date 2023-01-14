import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, signInAnonymously } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

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
    .then(() => {
        // Signed in..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });

const db = getFirestore(app);

connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, "http://localhost:9099");

// Initialize Firebase
export { db, auth };