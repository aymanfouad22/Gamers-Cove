import { httpPublic, httpAuth } from '@/lib/http';

export type GameDto = {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  releaseDate?: string;
  genres?: string[];
  platforms?: string[];
  developer?: string;
  publisher?: string;
};

export async function listGames(search?: string): Promise<GameDto[]> {
  try {
    console.log('Fetching games with search:', search);
    const params: Record<string, string> = {};
    if (search?.trim()) params.q = search.trim();
    
    console.log('Making request to /games with params:', params);
    const response = await httpPublic.get<GameDto[]>('/games', { params });
    
    // The response data should be the array of games
    const games = Array.isArray(response) ? response : [];
    console.log('Processed games:', games);
    return games;
  } catch (error: unknown) {
    console.error('Error in listGames:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          headers?: any;
          data?: any;
        };
      };
      
      if (axiosError.response) {
        console.error('Response error:', {
          status: axiosError.response.status,
          headers: axiosError.response.headers,
          data: axiosError.response.data
        });
      }
    }
    return [];
  }
}

export const getGame = (id: number) =>
  httpPublic.get<GameDto>(`/games/${id}`).then(res => res.data);

export const createGame = (body: Omit<GameDto, 'id'>) =>
  httpAuth.post<GameDto>('/games', body).then(res => res.data);

export const updateGame = (id: number, body: Partial<GameDto>) =>
  httpAuth.put<GameDto>(`/games/${id}`, body).then(res => res.data);

export const deleteGame = (id: number) =>
  httpAuth.delete<void>(`/games/${id}`).then(res => res.data);
