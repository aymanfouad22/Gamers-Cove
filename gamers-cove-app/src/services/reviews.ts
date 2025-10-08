import { httpPublic, httpAuth } from '@/lib/http';

export interface UserEntity {
  id: number;
  username: string;
  // Add other user properties as needed
}

export interface GameEntity {
  id: number;
  title: string;
  // Add other game properties as needed
}

export interface GameReview {
  id: number;
  user: UserEntity;
  game: GameEntity;
  rating: number;
  content: string;
  createdAt: string;
  // Computed properties (not from backend)
  userId?: number;
  comment?: string; // Alias for content
  isPublic?: boolean; // Not used in backend yet
}

export type CreateGameReviewInput = {
  rating: number;
  comment: string;
  isPublic: boolean;
};


export async function listReviewsByGame(
  gameId: number,
  opts?: { page?: number; limit?: number }
): Promise<GameReview[]> {
  try {
    const { page = 1, limit = 20 } = opts || {};
    console.log(`Fetching reviews for game ${gameId} - page ${page}, limit ${limit}`);
    
    // Get the token from localStorage
    const token = localStorage.getItem('backend_jwt');
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const baseUrl = 'http://localhost:8080/api';
    const response = await fetch(`${baseUrl}/games/${gameId}/reviews?page=${page}&limit=${limit}`, {
      headers,
      credentials: 'include', // Important for cookies if using them
    });
    
    console.log('Reviews response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error fetching reviews:', errorData);
      // Don't throw for 401/403 as we might want to show public reviews
      if (response.status !== 401 && response.status !== 403) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    // Parse the response as JSON
    const data = await response.json().catch(() => []);
    console.log('Raw reviews response:', data);
    
    // The response is already an array of reviews
    let reviews: GameReview[] = [];
    
    if (Array.isArray(data)) {
      reviews = data;
    } else if (data && typeof data === 'object') {
      // Handle different possible response structures
      if (Array.isArray(data.data)) {
        reviews = data.data;
      } else if (Array.isArray(data.content)) {
        reviews = data.content;
      } else if (Array.isArray(data)) {
        reviews = data;
      }
    }
    
    // Map the backend DTO to our frontend model
    const mappedReviews = reviews.map(review => ({
      ...review,
      comment: review.content || '',
      userId: review.user?.id,
      isPublic: review.isPublic !== undefined ? review.isPublic : true
    }));
    
    console.log('Processed reviews:', mappedReviews);
    return mappedReviews;
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: any;
          headers?: any;
        };
      };
      
      if (axiosError.response) {
        console.error('Error response:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
          headers: axiosError.response.headers
        });
      }
    }
    
    return [];
  }
}

// Helper function to get the auth token with debug logging
function getAuthToken(): string {
  // Check all possible storage keys
  const possibleKeys = ['backend_jwt', 'token', 'auth_token', 'jwt'];
  let token: string | null = null;
  
  // Log all localStorage contents for debugging
  console.log('LocalStorage contents:', Object.entries(localStorage));
  
  // Try each possible key
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`Found token with key '${key}'`);
      token = value;
      break;
    }
  }
  
  if (!token) {
    console.error('No authentication token found in localStorage');
    throw new Error('No authentication token found. Please log in again.');
  }
  
  return token;
}

export async function createReviewForGame(
  gameId: number,
  body: CreateGameReviewInput
): Promise<GameReview> {
  try {
    const token = getAuthToken();

    const response = await fetch(`http://localhost:8080/api/games/${gameId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'  // Some backends check for this
      },
      credentials: 'include',  // Important for cookies if using them
      body: JSON.stringify({
        ...body,
        content: body.comment, // Map comment to content for the backend
        isPublic: true
      })
    });

    console.log('Review submission response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Review submission error:', errorData);
      throw new Error(errorData.message || `Failed to submit review. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createReviewForGame:', error);
    throw error;
  }
}

export async function getReview(gameId: number, reviewId: number): Promise<GameReview> {
  const res = await httpPublic.get<GameReview>(`/games/${gameId}/reviews/${reviewId}`);
  return res.data;
}

export async function updateReview(
  gameId: number,
  reviewId: number,
  body: Partial<CreateGameReviewInput>
): Promise<GameReview> {
  const res = await httpAuth.put<GameReview>(`/games/${gameId}/reviews/${reviewId}`, body);
  return res.data;
}

export async function deleteReview(gameId: number, reviewId: number): Promise<void> {
  await httpAuth.delete(`/games/${gameId}/reviews/${reviewId}`);
}
