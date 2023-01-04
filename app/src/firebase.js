// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);