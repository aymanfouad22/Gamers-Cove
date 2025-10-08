// UI Helper Functions

// Create a game card element
const createGameCard = (game) => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    
    card.innerHTML = `
        <div class="card game-card h-100">
            ${game.coverImageUrl ? 
                `<img src="${game.coverImageUrl}" class="card-img-top" alt="${game.title}">` : 
                '<div class="card-img-top bg-secondary" style="height: 200px; display: flex; align-items: center; justify-content: center; color: white;">No Image</div>'
            }
            <div class="card-body">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text text-muted">${game.platforms?.join(', ') || 'Platform not specified'}</p>
                <p class="card-text">${game.description?.substring(0, 100)}${game.description?.length > 100 ? '...' : ''}</p>
            </div>
            <div class="card-footer bg-transparent">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary">${game.genres?.[0] || 'Game'}</span>
                    <button class="btn btn-sm btn-outline-primary view-game" data-game-id="${game.id}">View Details</button>
                </div>
            </div>
        </div>
    `;
    
    return card;
};

// Create a review card element
const createReviewCard = (review) => {
    const card = document.createElement('div');
    card.className = 'review-card mb-3 fade-in';
    
    // Format date
    const reviewDate = new Date(review.createdAt);
    const formattedDate = reviewDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create star rating
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    card.innerHTML = `
        <div class="review-header">
            <div>
                <h6 class="review-author mb-0">${review.user?.username || 'Anonymous'}</h6>
                <small class="text-muted">${formattedDate}</small>
            </div>
            <div class="rating-stars" title="${review.rating}/5">${stars}</div>
        </div>
        <p class="review-content mt-2">${review.content}</p>
        ${review.game ? 
            `<p class="review-meta">
                <i class="fas fa-gamepad me-1"></i> ${review.game.title}
            </p>` : ''
        }
    `;
    
    return card;
};

// Show loading state
const showLoading = (element) => {
    element.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading...</p>
        </div>
    `;
};

// Show error message
const showError = (element, message) => {
    element.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        </div>
    `;
};

// Show empty state
const showEmptyState = (element, message = 'No items found') => {
    element.innerHTML = `
        <div class="text-center py-5 text-muted">
            <i class="fas fa-inbox fa-3x mb-3"></i>
            <p class="mb-0">${message}</p>
        </div>
    `;
};

// Create pagination
const createPagination = (currentPage, totalPages, onPageChange) => {
    if (totalPages <= 1) return '';
    
    let pagination = '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">';
    
    // Previous button
    pagination += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" ${currentPage === 1 ? 'tabindex="-1"' : ''} data-page="${currentPage - 1}">
                &laquo; Previous
            </button>
        </li>
    `;
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
        pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pagination += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>
        `;
    }
    
    if (endPage < totalPages) {
        pagination += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
    
    // Next button
    pagination += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" ${currentPage === totalPages ? 'tabindex="-1"' : ''} data-page="${currentPage + 1}">
                Next &raquo;
            </button>
        </li>
    `;
    
    pagination += '</ul></nav>';
    
    // Add event listeners after the HTML is added to the DOM
    setTimeout(() => {
        document.querySelectorAll('.page-link[data-page]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }, 0);
    
    return pagination;
};

// Format date to relative time (e.g., "2 days ago")
const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;
    
    if (diffInSeconds < minute) return 'Just now';
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h ago`;
    if (diffInSeconds < month) return `${Math.floor(diffInSeconds / day)}d ago`;
    if (diffInSeconds < year) return `${Math.floor(diffInSeconds / month)}mo ago`;
    return `${Math.floor(diffInSeconds / year)}y ago`;
};

export {
    createGameCard,
    createReviewCard,
    showLoading,
    showError,
    showEmptyState,
    createPagination,
    formatRelativeTime
};
