// API Tester - Handles all API interactions
export const initApiTester = () => {
    // DOM Elements
    const responseEl = document.getElementById('response');
    const responseStatus = document.getElementById('response-status');
    const responseTime = document.getElementById('response-time');
    const copyBtn = document.getElementById('copy-response');
    
    // API Configuration - Using the correct port from config
    const API_BASE_URL = 'http://localhost:8081/api';
    
    // Helper function to make API requests
    const makeRequest = async (method, endpoint, data = null) => {
        const startTime = Date.now();
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
            mode: 'cors',
            credentials: 'include' // Include cookies if needed
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`Making ${method} request to:`, url);
            const response = await fetch(url, options);
            const responseTimeMs = Date.now() - startTime;
            
            let responseData;
            const contentType = response.headers.get('content-type');
            
            try {
                responseData = contentType?.includes('application/json') 
                    ? await response.json() 
                    : { message: await response.text() };
            } catch (e) {
                responseData = { 
                    message: 'Failed to parse response',
                    error: e.message,
                    status: response.status
                };
            }

            // Update UI
            responseEl.textContent = JSON.stringify(responseData, null, 2);
            responseStatus.textContent = `Status: ${response.status} ${response.statusText}`;
            responseTime.textContent = `Time: ${responseTimeMs}ms`;
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return { data: responseData, status: response.status };
        } catch (error) {
            console.error('API request failed:', error);
            const errorMessage = error.message || 'Failed to fetch';
            responseEl.textContent = `Error: ${errorMessage}`;
            responseStatus.textContent = 'Status: Error';
            responseTime.textContent = `Time: ${Date.now() - startTime}ms`;
            
            // Show error to user
            showToast(`API Error: ${errorMessage}`, 'error');
            
            throw error;
        }
    };

    // Copy response to clipboard
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(responseEl.textContent).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    // Set up event listeners for API buttons
    document.getElementById('get-games').addEventListener('click', () => {
        makeRequest('GET', '/games');
    });

    document.getElementById('get-game').addEventListener('click', () => {
        const gameId = document.getElementById('game-id').value;
        if (!gameId) {
            alert('Please enter a game ID');
            return;
        }
        makeRequest('GET', `/games/${gameId}`);
    });

    document.getElementById('create-game').addEventListener('click', () => {
        try {
            const gameData = JSON.parse(document.getElementById('game-json').value);
            makeRequest('POST', '/games', gameData);
        } catch (error) {
            alert('Invalid JSON data');
            console.error('JSON parse error:', error);
        }
    });

    // Reviews functionality
    document.getElementById('get-reviews').addEventListener('click', () => {
        const gameId = prompt('Enter Game ID to get reviews:');
        if (!gameId) {
            alert('Please enter a game ID');
            return;
        }
        makeRequest('GET', `/games/${gameId}/reviews`);
    });

    document.getElementById('get-review').addEventListener('click', () => {
        const reviewId = document.getElementById('review-id').value;
        if (!reviewId) {
            alert('Please enter a review ID');
            return;
        }
        makeRequest('GET', `/reviews/${reviewId}`);
    });

    document.getElementById('get-reviews-by-game').addEventListener('click', () => {
        const gameId = document.getElementById('review-game-id').value;
        if (!gameId) {
            alert('Please enter a game ID');
            return;
        }
        makeRequest('GET', `/games/${gameId}/reviews`);
    });

    document.getElementById('create-review').addEventListener('click', () => {
        try {
            const reviewData = JSON.parse(document.getElementById('review-json').value);
            // Add current user ID if available
            const user = firebase.auth().currentUser;
            if (user && !reviewData.userId) {
                reviewData.userId = user.uid;
                document.getElementById('review-json').value = JSON.stringify(reviewData, null, 2);
            }
            makeRequest('POST', '/reviews', reviewData);
        } catch (error) {
            alert('Invalid JSON data');
            console.error('JSON parse error:', error);
        }
    });

    document.getElementById('update-review').addEventListener('click', () => {
        try {
            const reviewId = document.getElementById('review-update-id').value;
            if (!reviewId) {
                alert('Please enter a review ID to update');
                return;
            }
            const reviewData = JSON.parse(document.getElementById('review-update-json').value);
            makeRequest('PUT', `/reviews/${reviewId}`, reviewData);
        } catch (error) {
            alert('Invalid JSON data');
            console.error('JSON parse error:', error);
        }
    });

    document.getElementById('delete-review').addEventListener('click', () => {
        const reviewId = document.getElementById('review-delete-id').value;
        if (!reviewId) {
            alert('Please enter a review ID to delete');
            return;
        }
        if (confirm('Are you sure you want to delete this review?')) {
            makeRequest('DELETE', `/reviews/${reviewId}`);
        }
    });

    // Initialize the API tester when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        // API tester is now initialized
        console.log('API Tester initialized');
    });
};
