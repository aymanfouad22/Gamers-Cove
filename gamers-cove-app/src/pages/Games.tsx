import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listGames, type GameDto } from '@/services/games';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Games() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: games = [], isLoading, isError, error } = useQuery({ 
    queryKey: ['games', searchQuery],
    queryFn: () => listGames(searchQuery),
  });

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase();
    return games.filter((game: GameDto) => {
      // Safely check if game or its properties are defined
      const titleMatch = game.title?.toLowerCase().includes(query) || false;
      const descriptionMatch = game.description?.toLowerCase().includes(query) || false;
      const genreMatch = game.genres?.some((genre: string) => 
        genre.toLowerCase().includes(query)
      ) || false;
      
      return titleMatch || descriptionMatch || genreMatch;
    });
  }, [games, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Games</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Games</h2>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Error loading games</h3>
              <div className="mt-2 text-sm text-destructive">
                <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Games</h2>
          <p className="text-muted-foreground">Browse our collection of games</p>
        </div>
        <Button asChild>
          <Link to="/games/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search games..."
          className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No games found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try a different search term' : 'No games available yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <Link to={`/games/${game.id}`} key={game.id} className="group">
              <Card className="h-full overflow-hidden transition-shadow duration-200 hover:shadow-lg">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={game.coverImageUrl || '/placeholder-game-cover.png'}
                    alt={game.title}
                    className="h-40 w-full object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-game-cover.png';
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{game.title}</CardTitle>
                  {game.releaseDate && (
                    <CardDescription>
                      {new Date(game.releaseDate).getFullYear()}
                      {game.genres?.length ? ` • ${game.genres[0]}` : ''}
                    </CardDescription>
                  )}
                </CardHeader>
                {game.description && (
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {game.description}
                    </p>
                  </CardContent>
                )}
                <CardFooter className="flex flex-col items-start gap-2 pt-2">
                  {game.platforms && game.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {game.platforms.slice(0, 3).map((platform: string) => (
                        <span 
                          key={platform} 
                          className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}
                  {game.genres && game.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {game.genres.slice(0, 3).map((genre: string) => (
                        <span 
                          key={genre} 
                          className="text-xs px-2 py-1 bg-secondary/30 rounded-md text-secondary-foreground"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
