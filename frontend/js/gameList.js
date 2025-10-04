// Helper function to validate URLs
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Game List functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game list when the page loads
    if (document.getElementById('game-list-tab')) {
        loadGames();
        setupSearch();
    }
});

// Load games from the API
async function loadGames(searchQuery = '') {
    const gameList = document.getElementById('game-list');
    if (!gameList) return;

    // Show loading state
    gameList.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading games...</p>
        </div>`;

    try {
        // Build the API URL with search query if provided
        let url = 'http://localhost:8081/api/games';
        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const games = await response.json();
        displayGames(games);
    } catch (error) {
        console.error('Error loading games:', error);
        gameList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load games. Please try again later.</p>
                <button onclick="loadGames()" class="btn btn-primary">
                    <i class="fas fa-sync-alt"></i> Retry
                </button>
            </div>`;
    }
}

// Display games in the UI
function displayGames(games) {
    const gameList = document.getElementById('game-list');
    if (!gameList) return;

    if (!games || games.length === 0) {
        gameList.innerHTML = `
            <div class="no-games">
                <i class="fas fa-gamepad"></i>
                <p>No games found. Try a different search term.</p>
            </div>`;
        return;
    }

    gameList.innerHTML = games.map(game => `
        <div class="game-card">
            ${game.coverImageUrl ? `
                ${game.coverImageUrl && isValidUrl(game.coverImageUrl) ? `
                    <img src="${game.coverImageUrl}" 
                         alt="${game.title}" 
                         class="game-cover"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Cover+Not+Found'"
                         loading="lazy">
                ` : `
                    <div class="game-cover-placeholder">
                        <i class="fas fa-gamepad"></i>
                        <span>No Cover Available</span>
                    </div>
                `}
            ` : ''}
            <div class="game-details">
                <h3 class="game-title">${game.title || 'Untitled Game'}</h3>
                ${game.description ? `
                    <p class="game-description">
                        ${game.description.length > 200 ? 
                          game.description.substring(0, 200) + '...' : 
                          game.description}
                    </p>
                ` : ''}
                <div class="game-meta">
                    ${game.genres && game.genres.length > 0 ? `
                        <span class="meta-item">
                            <i class="fas fa-tags"></i>
                            ${game.genres.join(', ')}
                        </span>
                    ` : ''}
                    ${game.platforms && game.platforms.length > 0 ? `
                        <span class="meta-item">
                            <i class="fas fa-tv"></i>
                            ${game.platforms.join(', ')}
                        </span>
                    ` : ''}
                    ${game.releaseDate ? `
                        <span class="meta-item">
                            <i class="far fa-calendar-alt"></i>
                            ${new Date(game.releaseDate).getFullYear()}
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('game-search');
    const searchButton = document.getElementById('search-btn');
    let searchTimeout;

    // Search on button click
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput ? searchInput.value.trim() : '';
            loadGames(query);
        });
    }

    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                loadGames(query);
            }
        });

        // Debounced search as user types
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            const query = searchInput.value.trim();
            searchTimeout = setTimeout(() => {
                loadGames(query);
            }, 500);
        });
    }
}

// Make functions available globally
window.loadGames = loadGames;
