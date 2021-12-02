// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqIbdr13FTvkKi8PX8iSB3FBGhJP40y7k",
  authDomain: "tinder-f4bcc.firebaseapp.com",
  projectId: "tinder-f4bcc",
  storageBucket: "tinder-f4bcc.appspot.com",
  messagingSenderId: "688642601723",
  appId: "1:688642601723:web:d4941352d64e808422765e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export {auth , db}
