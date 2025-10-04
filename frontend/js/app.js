import { initAuth, signInWithGoogle, signOutUser, getCurrentUser, getCurrentUserDbId } from './auth.js';
import * as api from './api.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth
    initAuth();
    console.log(' Gamers Cove API Tester initialized');
    
    // Initialize authentication
    initAuth();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup tabs
    setupTabs();
    
    // Check API status
    checkAPIStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Auth buttons
    document.getElementById('sign-in-btn').addEventListener('click', signInWithGoogle);
    document.getElementById('sign-out-btn').addEventListener('click', signOutUser);
}

// Setup tabs
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Check API status
async function checkAPIStatus() {
    try {
        const response = await fetch('http://localhost:8081/api/games');
        if (response.ok) {
            document.querySelector('.status-dot').style.background = '#10b981';
            console.log('✅ API is online');
        }
    } catch (error) {
        document.querySelector('.status-dot').style.background = '#ef4444';
        console.error('❌ API is offline');
        showToast('API server is offline. Please start the backend.', 'error');
    }
}

// ========== GAMES FUNCTIONS ==========

window.getAllGames = async function() {
    const result = await api.getAllGames();
    api.displayResult('games-result', result);
    if (result.success) {
        showToast(`Fetched ${result.data.length} games`, 'success');
    } else {
        showToast(result.error, 'error');
    }
};

window.getGameById = async function() {
    const gameId = document.getElementById('game-id-input').value;
    if (!gameId) {
        showToast('Please enter a game ID', 'warning');
        return;
    }
    
    const result = await api.getGameById(gameId);
    api.displayResult('games-result', result);
    if (result.success) {
        showToast('Game fetched successfully', 'success');
    } else {
        showToast(result.error, 'error');
    }
};

window.importGamesFromIGDB = async function() {
    if (!getCurrentUser()) {
        showToast('Please sign in to import games', 'warning');
        return;
    }
    
    showToast('Importing games from IGDB...', 'warning');
    const result = await api.importGamesFromIGDB();
    api.displayResult('games-result', result);
    
    if (result.success) {
        showToast('Games imported successfully!', 'success');
    } else {
        showToast(result.error, 'error');
    }
};

// ========== REVIEWS FUNCTIONS ==========

window.getGameReviews = async function() {
    const gameId = document.getElementById('game-reviews-id').value;
    if (!gameId) {
        showToast('Please enter a game ID', 'warning');
        return;
    }
    
    const result = await api.getGameReviews(gameId);
    api.displayResult('reviews-result', result);
    if (result.success) {
        showToast(`Fetched ${result.data.length} reviews`, 'success');
    } else {
        showToast(result.error, 'error');
    }
};

window.createReview = async function() {
    if (!getCurrentUser()) {
        showToast('Please sign in to create a review', 'warning');
        return;
    }
    
    const userId = getCurrentUserDbId();
    if (!userId) {
        showToast('User profile not loaded. Please refresh the page.', 'error');
        return;
    }
    
    const gameId = document.getElementById('review-game-id').value;
    const rating = document.getElementById('review-rating').value;
    const content = document.getElementById('review-content').value;
    
    if (!gameId || !rating || !content) {
        showToast('Please fill all fields', 'warning');
        return;
    }
    
    const reviewData = {
        userId: parseInt(userId),
        gameId: parseInt(gameId),
        rating: parseInt(rating),
        content: content
    };
    
    console.log('Creating review with data:', reviewData);
    
    const result = await api.createReview(reviewData);
    api.displayResult('reviews-result', result);
    
    if (result.success) {
        showToast('Review created successfully!', 'success');
        // Clear form
        document.getElementById('review-game-id').value = '';
        document.getElementById('review-rating').value = '';
        document.getElementById('review-content').value = '';
    } else {
        showToast(result.error, 'error');
    }
};

window.updateReview = async function() {
    if (!getCurrentUser()) {
        showToast('Please sign in to update a review', 'warning');
        return;
    }
    
    const reviewId = document.getElementById('update-review-id').value;
    const rating = document.getElementById('update-rating').value;
    const content = document.getElementById('update-content').value;
    
    if (!reviewId || !rating || !content) {
        showToast('Please fill all fields', 'warning');
        return;
    }
    
    const reviewData = {
        rating: parseInt(rating),
        content: content
    };
    
    const result = await api.updateReview(reviewId, reviewData);
    api.displayResult('reviews-result', result);
    
    if (result.success) {
        showToast('Review updated successfully!', 'success');
    } else {
        showToast(result.error, 'error');
    }
};

window.deleteReview = async function() {
    if (!getCurrentUser()) {
        showToast('Please sign in to delete a review', 'warning');
        return;
    }
    
    const reviewId = document.getElementById('delete-review-id').value;
    if (!reviewId) {
        showToast('Please enter a review ID', 'warning');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }
    
    const result = await api.deleteReview(reviewId);
    api.displayResult('reviews-result', result);
    
    if (result.success) {
        showToast('Review deleted successfully!', 'success');
    } else {
        showToast(result.error, 'error');
    }
};

// ========== USERS FUNCTIONS ==========

window.createUser = async function() {
    const firebaseUid = document.getElementById('user-firebase-uid').value;
    const username = document.getElementById('user-username').value;
    const email = document.getElementById('user-email').value;
    
    if (!firebaseUid || !username || !email) {
        showToast('Please fill all fields', 'warning');
        return;
    }
    
    const userData = {
        firebaseUid: firebaseUid,
        username: username,
        email: email
    };
    
    const result = await api.createUser(userData);
    api.displayResult('users-result', result);
    
    if (result.success) {
        showToast('User created successfully!', 'success');
        // Clear form
        document.getElementById('user-firebase-uid').value = '';
        document.getElementById('user-username').value = '';
        document.getElementById('user-email').value = '';
    } else {
        showToast(result.error, 'error');
    }
};

window.getUserByUsername = async function() {
    const username = document.getElementById('username-lookup').value;
    if (!username) {
        showToast('Please enter a username', 'warning');
        return;
    }
    
    const result = await api.getUserByUsername(username);
    api.displayResult('users-result', result);
    
    if (result.success) {
        showToast('User fetched successfully', 'success');
    } else {
        showToast(result.error, 'error');
    }
};

window.updateUserProfile = async function() {
    if (!getCurrentUser()) {
        showToast('Please sign in to update profile', 'warning');
        return;
    }
    
    const user = getCurrentUser();
    const username = document.getElementById('update-username').value;
    const bio = document.getElementById('update-bio').value;
    
    if (!username) {
        showToast('Please enter a username', 'warning');
        return;
    }
    
    const userData = {
        firebaseUid: user.uid,
        username: username,
        bio: bio || '',
        email: user.email
    };
    
    const result = await api.updateUserProfile(userData);
    api.displayResult('users-result', result);
    
    if (result.success) {
        showToast('Profile updated successfully!', 'success');
    } else {
        showToast(result.error, 'error');
    }
};

window.getUserFavorites = async function() {
    if (!getCurrentUser()) {
        showToast('Please sign in to view favorites', 'warning');
        return;
    }
    
    const userId = document.getElementById('user-id-favorites').value;
    if (!userId) {
        showToast('Please enter a user ID', 'warning');
        return;
    }
    
    const result = await api.getUserFavorites(userId);
    api.displayResult('users-result', result);
    
    if (result.success) {
        showToast('Favorites fetched successfully', 'success');
    } else {
        showToast(result.error, 'error');
    }
};
