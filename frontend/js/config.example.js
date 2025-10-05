// Copy this file to config.js and replace with your own Firebase credentials
// These are MOCK credentials - they won't work in production

export const firebaseConfig = {
    apiKey: "mock_api_key_1234567890",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456",
    measurementId: "G-XXXXXXXXXX"
};

// This prevents the config from being modified accidentally
Object.freeze(firebaseConfig);
