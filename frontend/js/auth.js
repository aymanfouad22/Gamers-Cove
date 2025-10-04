import { auth, googleProvider, db } from './firebase-config.js';
import { 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    collection, 
    query, 
    where 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let currentUser = null;
let authToken = null;

// Track if this is the initial auth state check
let initialAuthCheck = true;

// Initialize auth state listener
export function initAuth() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                authToken = await user.getIdToken();
                
                try {
                    // Check if user exists in Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    
                    if (userDoc.exists()) {
                        // For existing users, update the UI
                        const userData = userDoc.data();
                        console.log('Existing user found:', userData.username);
                        updateUIWithUser(userData.username, user.photoURL || userData.photoURL);
                        
                        // Hide the username modal if it's visible
                        const modal = document.getElementById('username-modal');
                        if (modal) modal.style.display = 'none';
                    } else {
                        // For new users, show the username modal
                        console.log('New user detected, showing username prompt');
                        showUsernameModal(user);
                    }
                    
                    console.log('User signed in:', user.email);
                    console.log('Firebase UID:', user.uid);
                } catch (error) {
                    console.error('Error checking user in Firestore:', error);
                }
            } else {
                currentUser = null;
                authToken = null;
                
                // Update UI for signed out state
                document.getElementById('sign-in-btn').style.display = 'flex';
                document.getElementById('user-info').style.display = 'none';
                document.getElementById('auth-status').innerHTML = '🔓 Not Authenticated';
                
                // Make sure username modal is hidden
                const modal = document.getElementById('username-modal');
                if (modal) modal.style.display = 'none';
                
                console.log('User signed out');
            }
            
            // Mark initial check as complete
            if (initialAuthCheck) {
                initialAuthCheck = false;
                resolve();
            }
        });
    });
}

// Check if user exists in Firestore
async function checkUserExists(firebaseUid) {
    try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUid));
        return userDoc.exists();
    } catch (error) {
        console.error('Error checking user in Firestore:', error);
        return false;
    }
}

// Show username modal
function showUsernameModal(user) {
    if (!user) return; // Don't show if no user
    
    const modal = document.getElementById('username-modal');
    if (!modal) {
        console.error('Username modal element not found');
        return;
    }
    
    const usernameInput = document.getElementById('username-input');
    const saveBtn = document.getElementById('save-username-btn');
    const closeBtn = document.getElementById('close-username-modal');
    
    if (!usernameInput || !saveBtn || !closeBtn) {
        console.error('Required modal elements not found');
        return;
    }
    
    // Reset the form
    usernameInput.value = '';
    
    // Suggest username from email (remove special chars)
    const suggestedUsername = user.email 
        ? user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
        : '';
    usernameInput.value = suggestedUsername;
    
    // Show the modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
        usernameInput.focus();
    }, 10);
    
    // Handle save button
    const saveUsername = async () => {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showToast('Please enter a username', 'warning');
            return;
        }
        
        if (username.length < 3) {
            showToast('Username must be at least 3 characters', 'warning');
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showToast('Username can only contain letters, numbers, and underscores', 'warning');
            return;
        }
        
        // Disable the save button to prevent double submission
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        try {
            // Check if username is already taken
            const usernameQuery = await getDocs(
                query(collection(db, 'users'), where('username', '==', username.toLowerCase()))
            );
            
            if (!usernameQuery.empty) {
                throw new Error('Username is already taken');
            }
            
            // Save username to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username: username.toLowerCase(),
                displayName: username,
                email: user.email,
                photoURL: user.photoURL || '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            
            // Hide modal with animation
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            
            // Update UI
            updateUIWithUser(username, user.photoURL);
            showToast(`Welcome to Gamers Cove, ${username}! 🎮`, 'success');
            
            // Dispatch custom event for other components to know the username was set
            document.dispatchEvent(new CustomEvent('usernameSet', { detail: { username } }));
            
        } catch (error) {
            console.error('Error creating user profile:', error);
            const errorMessage = error.message.includes('already exists') 
                ? 'Username is already taken' 
                : 'Error creating profile. Please try again.';
            showToast(errorMessage, 'error');
        } finally {
            // Re-enable the save button
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Username';
        }
    };
    
    // Event listeners
    saveBtn.onclick = saveUsername;
    
    // Close button
    closeBtn.onclick = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            // If user closes without setting username, sign them out
            signOutUser();
        }, 300);
    };
    
    // Close when clicking outside the modal
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    };
    
    // Allow Enter key to save
    usernameInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            saveUsername();
        }
    };
}

// Load existing user profile
async function loadUserProfile(user) {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            updateUIWithUser(userData.username, userData.photoURL || user.photoURL);
        }
        // If user doesn't exist, we'll handle it in the signInWithGoogle function
    } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to Google display name
        updateUIWithUser(user.displayName || user.email, user.photoURL);
    }
}

// Update UI with user info
function updateUIWithUser(username, avatarUrl) {
    document.getElementById('sign-in-btn').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-avatar').src = avatarUrl || 'https://via.placeholder.com/40';
    document.getElementById('user-name').textContent = username;
    document.getElementById('auth-status').innerHTML = '🔒 Authenticated as ' + username;
}

// Sign in with Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const token = await user.getIdToken();
        
        console.log('Sign in successful');
        console.log('User:', user.email);
        console.log('Token:', token.substring(0, 50) + '...');
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
            console.log('New user detected, showing username modal');
            // Show username modal for new users with a small delay to ensure UI is ready
            setTimeout(() => {
                const modal = document.getElementById('username-modal');
                if (modal) {
                    // Only show if not already showing
                    if (modal.style.display !== 'flex') {
                        showUsernameModal(user);
                    }
                }
            }, 500);
        } else {
            // For returning users, update the UI
            const userData = userDoc.data();
            console.log('Returning user:', userData.username);
            updateUIWithUser(userData.username, user.photoURL || userData.photoURL);
            showToast(`Welcome back, ${userData.username}! 🎮`, 'success');
            
            // Make sure username modal is hidden
            const modal = document.getElementById('username-modal');
            if (modal) modal.style.display = 'none';
        }
        
        return { user, token };
    } catch (error) {
        console.error('Sign in error:', error);
        showToast('Sign in failed: ' + error.message, 'error');
        throw error;
    }
}

// Sign out
export async function signOutUser() {
    try {
        await signOut(auth);
        showToast('Signed out successfully', 'success');
    } catch (error) {
        console.error('Sign out error:', error);
        showToast('Sign out failed: ' + error.message, 'error');
    }
}

// Get current auth token
export async function getAuthToken() {
    if (currentUser) {
        // Refresh token if needed
        authToken = await currentUser.getIdToken(true);
        return authToken;
    }
    return null;
}

// Get current user
export function getCurrentUser() {
    return currentUser;
}

// Get current user's database ID
let currentUserDbId = null;

export function getCurrentUserDbId() {
    return currentUserDbId;
}

export function setCurrentUserDbId(id) {
    currentUserDbId = id;
}

// Check if user is authenticated
export function isAuthenticated() {
    return currentUser !== null;
}

// Toast notification helper
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make showToast available globally
window.showToast = showToast;
