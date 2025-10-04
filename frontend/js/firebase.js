// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmvxeKXRJNJH-MY--9PpodY7_vpYsnZaI",
  authDomain: "gamers-cove-profile.firebaseapp.com",
  projectId: "gamers-cove-profile",
  storageBucket: "gamers-cove-profile.firebasestorage.app",
  messagingSenderId: "231256195384",
  appId: "1:231256195384:web:cab9fc916eb2ccd00781cd",
  measurementId: "G-QVTQ1QKWXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
