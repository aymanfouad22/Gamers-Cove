// Game related types
export interface GameDto {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  genres: string[];
  platforms: string[];
  coverImageUrl?: string;
  externalApiId?: string;
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameCreateDto extends Omit<GameDto, 'id' | 'createdAt' | 'updatedAt'> {}
export interface GameUpdateDto extends Partial<GameCreateDto> {}

// Review related types
export interface ReviewDto {
  id: string;
  gameId: string;
  userId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user?: UserDto;
  game?: GameDto;
}

export interface ReviewCreateDto {
  gameId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
}

export interface ReviewUpdateDto extends Partial<ReviewCreateDto> {}

// User related types
export interface UserDto {
  id: string;
  firebaseUid: string;
  email: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  gamertags?: Record<string, string>;
  gamertagsVisibility?: Record<string, boolean>;
  role?: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateDto {
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  gamertags?: Record<string, string>;
  gamertagsVisibility?: Record<string, boolean>;
}

// Auth related types
export interface LoginResponse {
  token: string;
  user: UserDto;
  needsUsername: boolean;
}

export interface LoginRequest {
  idToken: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search and filter types
export interface GameFilterParams extends PaginationParams {
  search?: string;
  genres?: string[];
  platforms?: string[];
  minRating?: number;
  minReleaseYear?: number;
  maxReleaseYear?: number;
}

export interface ReviewFilterParams extends PaginationParams {
  gameId?: string;
  userId?: string;
  isPublic?: boolean;
  minRating?: number;
  maxRating?: number;
}

// UI related types
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}
