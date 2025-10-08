// App UI Module - Handles all UI interactions
export const initAppUI = () => {
    console.log('Initializing App UI...');
    
    // Initialize UI components
    initStatusBar();
    initTabs();
    initModals();
    initButtons();
    initForms();
    
    // Simulate API connection
    simulateAPIConnection();
    
    console.log('App UI initialized');
};

// Status bar functionality
const initStatusBar = () => {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // Make updateStatusBar globally available
    window.updateStatusBar = (status) => {
        const authStatusText = document.getElementById('auth-status-text');
        const apiStatusDot = document.querySelector('#api-status .status-dot');
        const apiStatusText = document.getElementById('api-status-text');
        const userActions = document.getElementById('user-actions');
        
        if (status.auth) {
            authStatusText.textContent = `Signed in as ${status.auth.displayName || 'User'}`;
            userActions?.classList.remove('d-none');
        } else {
            authStatusText.textContent = 'Not signed in';
            userActions?.classList.add('d-none');
        }
        
        if (status.api) {
            apiStatusDot.className = 'status-dot connected';
            apiStatusText.textContent = 'API: Connected';
        } else {
            apiStatusDot.className = 'status-dot';
            apiStatusText.textContent = 'API: Disconnected';
        }
    };
};

// Simulate API connection
const simulateAPIConnection = () => {
    setTimeout(() => {
        window.updateStatusBar({ api: true });
    }, 1500);
};

// Refresh data function
const refreshData = () => {
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Refreshing...';
        
        // Simulate refresh delay
        setTimeout(() => {
            // Get the active tab and refresh its content
            const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
            if (activeTab) {
                refreshTabContent(activeTab);
            }
            
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = originalText;
            showToast('Data refreshed successfully', 'success');
        }, 1000);
    }
};

// Refresh content of a specific tab
const refreshTabContent = (tabId) => {
    console.log(`Refreshing ${tabId} content...`);
    // Add tab-specific refresh logic here
    switch (tabId) {
        case 'game-list':
            // Refresh game list
            const loadButton = document.getElementById('load-games');
            if (loadButton) loadButton.click();
            break;
        case 'games':
            // Refresh games API tab
            const getAllGamesBtn = document.getElementById('get-all-games');
            if (getAllGamesBtn) getAllGamesBtn.click();
            break;
        case 'reviews':
            // Refresh reviews tab
            const getReviewsBtn = document.getElementById('get-reviews-btn');
            if (getReviewsBtn) getReviewsBtn.click();
            break;
        case 'profile':
            // Refresh profile tab
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // Trigger profile refresh
                window.dispatchEvent(new CustomEvent('user-updated', { detail: user }));
            }
            break;
    }
};

// Tab functionality
const initTabs = () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = `${button.dataset.tab}-tab`;
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
};

// Modal functionality
const initModals = () => {
    console.log('Initializing modals...');
    
    // Username modal elements
    const usernameModal = document.getElementById('username-modal');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const closeUsernameModal = document.getElementById('close-username-modal');
    const usernameInput = document.getElementById('username-input');
    
    // Initialize modal instance
    let usernameModalInstance = null;
    
    // Function to initialize the modal
    const initUsernameModal = () => {
        if (!usernameModal) return;
        
        // Check if already initialized
        if (usernameModal._modal) {
            usernameModalInstance = usernameModal._modal;
            return;
        }
        
        // Initialize Bootstrap modal
        try {
            usernameModalInstance = new bootstrap.Modal(usernameModal, {
                backdrop: 'static',
                keyboard: false,
                focus: true
            });
            usernameModal._modal = usernameModalInstance;
            
            // Show modal if user needs to set a username
            const user = firebase.auth().currentUser;
            if (user && localStorage.getItem(`needs_username_${user.uid}`) === 'true') {
                // Small delay to ensure modal is properly initialized
                setTimeout(() => {
                    usernameModalInstance.show();
                    if (usernameInput) usernameInput.focus();
                }, 100);
            }
        } catch (e) {
            console.error('Error initializing username modal:', e);
        }
    };
    
    // Save username handler
    const saveUsername = async () => {
        try {
            const username = usernameInput?.value?.trim();
            if (!username) {
                showToast('Please enter a username', 'error');
                return;
            }
            
            const user = firebase.auth().currentUser;
            if (!user) {
                showToast('User not authenticated', 'error');
                return;
            }
            
            // TODO: Save username to database
            console.log('Saving username:', username, 'for user:', user.uid);
            
            // For now, save to localStorage
            localStorage.setItem(`username_${user.uid}`, username);
            localStorage.removeItem(`needs_username_${user.uid}`);
            
            // Hide modal
            if (usernameModalInstance) {
                usernameModalInstance.hide();
            }
            
            showToast('Username saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving username:', error);
            showToast('Error saving username', 'error');
        }
    };
    
    // Event listeners
    if (saveUsernameBtn) {
        saveUsernameBtn.addEventListener('click', saveUsername);
    }
    
    if (closeUsernameModal) {
        closeUsernameModal.addEventListener('click', () => {
            if (usernameModalInstance) {
                usernameModalInstance.hide();
            }
        });
    }
    
    // Close when clicking outside
    if (usernameModal) {
        usernameModal.addEventListener('click', (e) => {
            if (e.target === usernameModal && usernameModalInstance) {
                usernameModalInstance.hide();
            }
        });
    }
    
    // Initialize the modal when the page loads
    if (document.readyState === 'complete') {
        initUsernameModal();
    } else {
        window.addEventListener('load', initUsernameModal);
    }
    
    // Also initialize when the auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            initUsernameModal();
        }
    });
    
    // Make the modal instance available globally for other scripts
    window.usernameModalInstance = usernameModalInstance;
};

// Button functionality
const initButtons = () => {
    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = document.getElementById('game-search').value.trim();
            if (searchTerm) {
                // TODO: Implement search functionality
                console.log('Searching for:', searchTerm);
                showToast(`Searching for: ${searchTerm}`, 'info');
            }
        });
    }
    
    // Other action buttons
    const actionButtons = {
        'get-all-games': () => fetchAllGames(),
        'get-game-by-id': () => {
            const gameId = document.getElementById('game-id-input').value;
            if (gameId) fetchGameById(gameId);
            else showToast('Please enter a game ID', 'error');
        },
        'import-games': () => importGamesFromIGDB(),
        'get-reviews-btn': () => {
            const gameId = document.getElementById('game-reviews-id').value;
            if (gameId) fetchGameReviews(gameId);
            else showToast('Please enter a game ID', 'error');
        },
        'create-review-btn': () => createReview()
    };
    
    // Add event listeners to all action buttons
    Object.entries(actionButtons).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
};

// Form submissions
const initForms = () => {
    // Review form
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createReview();
        });
    }
};

// Show toast notification
const showToast = (message, type = 'info') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        });
    }
};

// API Functions
const fetchAllGames = async () => {
    try {
        // TODO: Implement fetch all games
        showToast('Fetching all games...', 'info');
        console.log('Fetching all games...');
    } catch (error) {
        console.error('Error fetching games:', error);
        showToast('Failed to fetch games', 'error');
    }
};

const fetchGameById = async (gameId) => {
    try {
        // TODO: Implement fetch game by ID
        showToast(`Fetching game with ID: ${gameId}`, 'info');
        console.log('Fetching game with ID:', gameId);
    } catch (error) {
        console.error('Error fetching game:', error);
        showToast('Failed to fetch game', 'error');
    }
};

const importGamesFromIGDB = async () => {
    try {
        // TODO: Implement import games from IGDB
        showToast('Importing games from IGDB...', 'info');
        console.log('Importing games from IGDB...');
    } catch (error) {
        console.error('Error importing games:', error);
        showToast('Failed to import games', 'error');
    }
};

const fetchGameReviews = async (gameId) => {
    try {
        // TODO: Implement fetch game reviews
        showToast(`Fetching reviews for game ID: ${gameId}`, 'info');
        console.log('Fetching reviews for game ID:', gameId);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        showToast('Failed to fetch reviews', 'error');
    }
};

const createReview = async () => {
    const gameId = document.getElementById('review-game-id')?.value;
    const rating = document.getElementById('review-rating')?.value;
    const content = document.getElementById('review-content')?.value;
    
    if (!gameId || !rating || !content) {
        showToast('Please fill in all review fields', 'error');
        return;
    }
    
    try {
        // TODO: Implement create review
        console.log('Creating review:', { gameId, rating, content });
        showToast('Review submitted successfully!', 'success');
        
        // Clear form
        document.getElementById('review-rating').value = '';
        document.getElementById('review-content').value = '';
    } catch (error) {
        console.error('Error creating review:', error);
        showToast('Failed to submit review', 'error');
    }
};

// Initialize UI when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppUI);
} else {
    initAppUI();
}
