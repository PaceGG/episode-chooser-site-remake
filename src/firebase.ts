// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFIw6KkVRZxK2OilLxqailQ1ggdC5-pKk",
  authDomain: "episode-chooser-27d75.firebaseapp.com",
  projectId: "episode-chooser-27d75",
  storageBucket: "episode-chooser-27d75.firebasestorage.app",
  messagingSenderId: "947636423587",
  appId: "1:947636423587:web:77f548533b7bcc196ea816",
  measurementId: "G-JC0GPFLRN6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
