import { getAuthToken, isAuthenticated } from './auth.js';

const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add auth token if available
    const token = await getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    console.log(`🌐 ${options.method || 'GET'} ${url}`);
    if (token) {
        console.log('🔑 Using auth token:', token.substring(0, 50) + '...');
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('✅ Response:', data);
        return { success: true, data, status: response.status };
    } catch (error) {
        console.error('❌ Error:', error);
        return { success: false, error: error.message, status: error.status };
    }
}

// ========== GAMES API ==========

export async function getAllGames() {
    return apiRequest('/games');
}

export async function getGameById(gameId) {
    return apiRequest(`/games/${gameId}`);
}

export async function importGamesFromIGDB() {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest('/games/import-from-igdb', { method: 'POST' });
}

// ========== REVIEWS API ==========

export async function getGameReviews(gameId) {
    return apiRequest(`/games/${gameId}/reviews`);
}

export async function getReviewById(reviewId) {
    return apiRequest(`/reviews/${reviewId}`);
}

export async function createReview(reviewData) {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
}

export async function updateReview(reviewId, reviewData) {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
    });
}

export async function deleteReview(reviewId) {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest(`/reviews/${reviewId}`, {
        method: 'DELETE'
    });
}

export async function getUserReviews(userId) {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest(`/users/${userId}/reviews`);
}

// ========== USERS API ==========

export async function createUser(userData) {
    return apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

export async function getUserByUsername(username) {
    return apiRequest(`/users/username/${username}`);
}

export async function updateUserProfile(userData) {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
}

export async function getUserFavorites(userId) {
    if (!isAuthenticated()) {
        return { success: false, error: 'Authentication required' };
    }
    return apiRequest(`/users/${userId}/favorite_games`);
}

// ========== UTILITY FUNCTIONS ==========

export function displayResult(resultBoxId, result) {
    const resultBox = document.getElementById(resultBoxId);
    
    if (result.success) {
        resultBox.textContent = JSON.stringify(result.data, null, 2);
        resultBox.style.color = '#10b981';
    } else {
        resultBox.textContent = `ERROR: ${result.error}`;
        resultBox.style.color = '#ef4444';
    }
}
