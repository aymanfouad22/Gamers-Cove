import { apiConfig } from './config.js';

const API_BASE_URL = apiConfig.baseUrl;

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

// Get auth headers with JWT token
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (user?.uid) {
        return auth.currentUser.getIdToken().then(token => {
            return {
                ...headers,
                'Authorization': `Bearer ${token}`
            };
        });
    }
    
    return Promise.resolve(headers);
};

// API Service
const api = {
    // Game endpoints
    games: {
        // Get all games
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/games`);
            return handleResponse(response);
        },
        
        // Get a single game by ID
        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/games/${id}`);
            return handleResponse(response);
        },
        
        // Search games
        search: async (query) => {
            const response = await fetch(`${API_BASE_URL}/games/search?q=${encodeURIComponent(query)}`);
            return handleResponse(response);
        }
    },
    
    // Review endpoints
    reviews: {
        // Create a new review
        create: async (reviewData) => {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers,
                body: JSON.stringify(reviewData)
            });
            return handleResponse(response);
        },
        
        // Get reviews for a game
        getByGameId: async (gameId) => {
            const response = await fetch(`${API_BASE_URL}/reviews/game/${gameId}`);
            return handleResponse(response);
        },
        
        // Get reviews by user
        getByUserId: async (userId) => {
            const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`);
            return handleResponse(response);
        },
        
        // Update a review
        update: async (reviewId, reviewData) => {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(reviewData)
            });
            return handleResponse(response);
        },
        
        // Delete a review
        delete: async (reviewId) => {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers
            });
            return handleResponse(response);
        }
    },
    
    // User endpoints
    users: {
        // Get user by ID
        getById: async (userId) => {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`);
            return handleResponse(response);
        },
        
        // Get user by Firebase UID
        getByFirebaseUid: async (firebaseUid) => {
            const response = await fetch(`${API_BASE_URL}/users/firebase/${firebaseUid}`);
            return handleResponse(response);
        },
        
        // Update user profile
        update: async (userId, userData) => {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(userData)
            });
            return handleResponse(response);
        }
    },
    
    // Helper to get the current user's data
    getCurrentUser: async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.uid) return null;
        
        try {
            return await api.users.getByFirebaseUid(user.uid);
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    }
};

export default api;
