import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvtrVgpTe9uNtZLdGjGaHHOoeAx_U0b1c",
    authDomain: "chat-message-app-e1409.firebaseapp.com",
    databaseURL: "https://chat-message-app-e1409-default-rtdb.firebaseio.com",
    projectId: "chat-message-app-e1409",
    storageBucket: "chat-message-app-e1409.appspot.com",
    messagingSenderId: "105053602961",
    appId: "1:105053602961:web:0e9dabe2141c1b72e8ab30"
};



const auth = getAuth(app);
const db = getFirestore();
const realtimeDb = getDatabase();

connectFirestoreEmulator(db, 'localhost', 8082);
connectAuthEmulator(auth, "http://localhost:9099");
connectDatabaseEmulator(realtimeDb, "localhost", 9000);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { db, auth, realtimeDb };