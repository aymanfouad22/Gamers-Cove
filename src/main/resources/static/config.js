// This file is loaded before any other scripts in your application
// It makes environment variables available globally through window.config

window.config = {
    // Firebase Configuration
    FIREBASE_API_KEY: "YOUR_API_KEY_HERE",
    FIREBASE_AUTH_DOMAIN: "YOUR_PROJECT_ID.firebaseapp.com",
    FIREBASE_PROJECT_ID: "YOUR_PROJECT_ID",
    FIREBASE_STORAGE_BUCKET: "YOUR_PROJECT_ID.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "YOUR_MESSAGING_SENDER_ID",
    FIREBASE_APP_ID: "YOUR_APP_ID",
    FIREBASE_MEASUREMENT_ID: "YOUR_MEASUREMENT_ID"
};

// Prevent modification of the config object
Object.freeze(window.config);
