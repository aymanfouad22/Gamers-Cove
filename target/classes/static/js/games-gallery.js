// Games Gallery - Handles the games gallery functionality
export const initGamesGallery = () => {
    console.log('Initializing Games Gallery...');
    const loadButton = document.getElementById('load-games');
    
    if (!loadButton) {
        console.error('Load games button not found');
        return;
    }
    
    loadButton.addEventListener('click', async () => {
        const API_BASE_URL = 'http://localhost:8082/api';
        const gamesContainer = document.getElementById('games-container');
        
        if (!gamesContainer) {
            console.error('Games container not found');
            return;
        }
        
        try {
            console.log('Fetching games from API...');
            // Show loading state
            gamesContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
            
            const response = await fetch(`${API_BASE_URL}/games`);
            console.log('API response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const games = await response.json();
            console.log('Games loaded:', games);
            gamesContainer.innerHTML = ''; // Clear loading state
            
            if (!games || !Array.isArray(games) || games.length === 0) {
                gamesContainer.innerHTML = '<div class="col"><div class="alert alert-info">No games found in the database.</div></div>';
                return;
            }
            
            games.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.className = 'col';
                gameCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${game.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                             class="card-img-top" 
                             alt="${game.title}"
                             style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${game.title || 'Untitled Game'}</h5>
                            <p class="card-text text-muted">${game.developer || 'Unknown Developer'}</p>
                            <p class="card-text">${(game.description || '').substring(0, 100)}${game.description && game.description.length > 100 ? '...' : ''}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-primary">$${game.price ? game.price.toFixed(2) : 'N/A'}</span>
                                <div>
                                    ${(game.genres || []).map(genre => 
                                        `<span class="badge bg-secondary me-1">${genre}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-top-0">
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary view-game" data-id="${game.id}">
                                    <i class="fas fa-eye me-1"></i> View Details
                                </button>
                                <button class="btn btn-sm btn-outline-success add-review" data-id="${game.id}">
                                    <i class="fas fa-comment me-1"></i> Review
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                gamesContainer.appendChild(gameCard);
            });
            
            // Add event listeners to the new buttons
            document.querySelectorAll('.view-game').forEach(button => {
                button.addEventListener('click', (e) => {
                    const gameId = e.target.closest('button').dataset.id;
                    alert(`Viewing game with ID: ${gameId}`);
                    // You can implement the view details functionality here
                });
            });
            
            document.querySelectorAll('.add-review').forEach(button => {
                button.addEventListener('click', (e) => {
                    const gameId = e.target.closest('button').dataset.id;
                    // Switch to the Reviews tab and pre-fill the game ID
                    const reviewTab = new bootstrap.Tab(document.getElementById('reviews-tab'));
                    reviewTab.show();
                    document.getElementById('review-json').value = JSON.stringify({
                        gameId: parseInt(gameId),
                        rating: 5,
                        comment: "",
                        pros: [],
                        cons: [],
                        isRecommended: true
                    }, null, 2);
                });
            });
            
        } catch (error) {
            console.error('Error loading games:', error);
            if (gamesContainer) {
                gamesContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">
                            <h5>Error loading games</h5>
                            <p class="mb-0">${error.message || 'Please check the console for more details.'}</p>
                        </div>
                    </div>`;
            }
        }
    });
};
