// Firebase Authentication
import { firebaseConfig } from './config.js';

export const initAuth = () => {
    console.log('Initializing Firebase Auth...');
    
    // Initialize Firebase if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Firebase Auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        const signInBtn = document.getElementById('sign-in-btn');
        const signOutBtn = document.getElementById('sign-out-btn');
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');
        
        // Update UI based on auth state
        if (user) {
            // User is signed in
            console.log('User signed in:', user);
            
            // Update UI elements
            if (signInBtn) signInBtn.style.display = 'none';
            if (signOutBtn) signOutBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'flex';
            
            // Set user info
            if (userName) {
                userName.textContent = user.displayName || user.email || 'User';
            }
            
            if (userAvatar) {
                userAvatar.src = user.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                userAvatar.alt = user.displayName || 'User Avatar';
            }
            
            // Get the user's ID token
            user.getIdToken().then((token) => {
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }));
                
                // Update status bar
                if (window.updateStatusBar) {
                    window.updateStatusBar({
                        auth: {
                            displayName: user.displayName || user.email,
                            email: user.email,
                            photoURL: user.photoURL
                        },
                        api: true
                    });
                }
                
                // Check if user has a username set
                checkUsername(user);
            });
        } else {
            // User is signed out
            console.log('User signed out');
            
            // Update UI elements
            if (signInBtn) signInBtn.style.display = 'block';
            if (signOutBtn) signOutBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'none';
            
            // Clear stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Update status bar
            if (window.updateStatusBar) {
                window.updateStatusBar({ auth: null, api: true });
            }
        }
    });

    // Sign in handler
    const signInBtn = document.getElementById('sign-in-btn');
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            
            firebase.auth().signInWithPopup(provider).catch((error) => {
                console.error('Sign in error:', error);
                showToast(error.message, 'error');
            });
        });
    }

    // Sign out handler
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            firebase.auth().signOut().catch((error) => {
                console.error('Sign out error:', error);
                showToast(error.message, 'error');
            });
        });
    }
};

// Check if user has a username set
const checkUsername = async (user) => {
    try {
        // First check localStorage to avoid unnecessary API calls
        const localStorageUsername = localStorage.getItem(`username_${user.uid}`);
        if (localStorageUsername) return;
        
        // Then check the database
        const response = await fetch(`/api/users/${user.uid}/username`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await user.getIdToken()}`
            }
        });

        if (!response.ok && response.status === 404) {
            // If user doesn't have a username, store a flag and let the UI handle it
            localStorage.setItem(`needs_username_${user.uid}`, 'true');
            // Dispatch a custom event to notify the UI
            document.dispatchEvent(new CustomEvent('username-required', { 
                detail: { userId: user.uid } 
            }));
        } else if (!response.ok) {
            console.error('Error checking username:', await response.text());
        }
    } catch (error) {
        console.error('Error checking username:', error);
        // Fallback to localStorage if API fails
        if (!localStorage.getItem(`username_${user.uid}`)) {
            localStorage.setItem(`needs_username_${user.uid}`, 'true');
        }
    }
};

// Listen for the custom event to show the username modal
document.addEventListener('username-required', (event) => {
    const modal = document.getElementById('username-modal');
    if (modal) {
        // Use a small timeout to ensure the UI is ready
        requestAnimationFrame(() => {
            const modalInstance = new bootstrap.Modal(modal, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        });
    }
});

// Show toast notification (compatible with existing code)
const showToast = (message, type = 'info') => {
    if (window.showToast) {
        window.showToast(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('d-none');
        }, 5000);
    } else {
        console.error('Error message element not found');
    }
}
