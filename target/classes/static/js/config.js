// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyDmvxeKXRJNJH-MY--9PpodY7_vpYsnZaI",
    authDomain: "gamers-cove-profile.firebaseapp.com",
    projectId: "gamers-cove-profile",
    storageBucket: "gamers-cove-profile.appspot.com",
    messagingSenderId: "231256195384",
    appId: "1:231256195384:web:cab9fc916eb2ccd00781cd",
    measurementId: "G-QVTQ1QKWXB"
};

// API Configuration
export const apiConfig = {
    baseUrl: "http://localhost:8080/api"
};

// For backward compatibility
window.config = {
    FIREBASE_API_KEY: firebaseConfig.apiKey,
    FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
    FIREBASE_PROJECT_ID: firebaseConfig.projectId,
    FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
    FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
    FIREBASE_APP_ID: firebaseConfig.appId,
    FIREBASE_MEASUREMENT_ID: firebaseConfig.measurementId
};

// Prevent modification of the config objects
Object.freeze(firebaseConfig);
Object.freeze(apiConfig);
Object.freeze(window.config);
