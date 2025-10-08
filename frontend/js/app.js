import api from './api.js';
import { 
    createGameCard, 
    createReviewCard, 
    showLoading, 
    showError, 
    showEmptyState 
} from './ui.js';

// DOM Elements
const gamesContainer = document.getElementById('games-container');
const reviewsContainer = document.getElementById('reviews-container');
const reviewForm = document.getElementById('review-form');
const gameSelect = document.getElementById('game-select');

// State
let currentUser = null;

// Initialize the application
const init = async () => {
    try {
        // Load current user
        currentUser = await api.getCurrentUser();
        
        // Load initial data
        await Promise.all([
            loadGames(),
            loadReviews(),
            loadGameSelect()
        ]);
        
        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(document.querySelector('main'), 'Failed to load application. Please refresh the page.');
    }
};

// Load games
const loadGames = async () => {
    if (!gamesContainer) return;
    
    try {
        showLoading(gamesContainer);
        const games = await api.games.getAll();
        
        if (games.length === 0) {
            showEmptyState(gamesContainer, 'No games found');
            return;
        }
        
        gamesContainer.innerHTML = '';
        games.forEach(game => {
            const gameCard = createGameCard(game);
            gamesContainer.appendChild(gameCard);
        });
        
        // Add event listeners to view game buttons
        document.querySelectorAll('.view-game').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.dataset.gameId;
                viewGameDetails(gameId);
            });
        });
    } catch (error) {
        console.error('Error loading games:', error);
        showError(gamesContainer, 'Failed to load games. Please try again later.');
    }
};

// Load reviews
const loadReviews = async () => {
    if (!reviewsContainer) return;
    
    try {
        showLoading(reviewsContainer);
        // In a real app, you might want to paginate this or filter by game
        const reviews = await api.reviews.getAll();
        
        if (reviews.length === 0) {
            showEmptyState(reviewsContainer, 'No reviews yet. Be the first to leave one!');
            return;
        }
        
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            reviewsContainer.appendChild(reviewCard);
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
        showError(reviewsContainer, 'Failed to load reviews. Please try again later.');
    }
};

// Load game select dropdown
const loadGameSelect = async () => {
    if (!gameSelect) return;
    
    try {
        const games = await api.games.getAll();
        
        // Clear existing options except the first one
        while (gameSelect.options.length > 1) {
            gameSelect.remove(1);
        }
        
        // Add games to select
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = game.title;
            gameSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading games for select:', error);
    }
};

// Handle review form submission
const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please sign in to leave a review');
        return;
    }
    
    const formData = new FormData(reviewForm);
    const reviewData = {
        gameId: formData.get('gameId'),
        rating: parseInt(formData.get('rating')),
        content: formData.get('content'),
        userId: currentUser.id
    };
    
    try {
        const submitButton = reviewForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        
        // Submit review
        await api.reviews.create(reviewData);
        
        // Reset form
        reviewForm.reset();
        
        // Show success message
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.role = 'alert';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Review submitted successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        reviewForm.prepend(alert);
        
        // Reload reviews
        await loadReviews();
        
        // Auto-dismiss alert after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, 5000);
    } catch (error) {
        console.error('Error submitting review:', error);
        alert(`Failed to submit review: ${error.message}`);
    } finally {
        // Reset button state
        const submitButton = reviewForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Review';
    }
};

// View game details
const viewGameDetails = (gameId) => {
    // In a real app, you would navigate to a game details page or show a modal
    console.log('Viewing game details for ID:', gameId);
    // Example: window.location.href = `/game.html?id=${gameId}`;
};

// Set up event listeners
const setupEventListeners = () => {
    // Review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    // Add any other global event listeners here
};

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
