// This is an example configuration file. Copy this to config.js and fill in your Firebase credentials.

// Firebase configuration
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// API Configuration
export const apiConfig = {
    baseUrl: "http://localhost:8080/api" // Update this to your backend URL in production
};

// Prevent modification of the config
Object.freeze(firebaseConfig);
Object.freeze(apiConfig);
