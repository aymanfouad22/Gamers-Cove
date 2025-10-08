import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listGames, type GameDto } from '@/services/games';
import {
  listReviewsByGame,
  createReviewForGame,
  type GameReview,
  type CreateGameReviewInput,
} from '@/services/reviews';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Star, Loader2, MessageSquarePlus, AlertCircle, RefreshCw } from 'lucide-react';

export default function ReviewsPage() {
  const qc = useQueryClient()
  const { user } = useAuth()

  // State for game selection and search
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  
  // State for review form
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [isPublic, setIsPublic] = useState<boolean>(true)

  // Fetch all games
  const { 
    data: games = [], 
    isLoading: gamesLoading, 
    isError: gamesError, 
    error: gamesErrorData 
  } = useQuery<GameDto[]>({
    queryKey: ['games'],
    queryFn: () => listGames(),
    staleTime: 30_000,
  })

  // Auto-select the first game when games are loaded
  useEffect(() => {
    if (games.length > 0 && !selectedGameId) {
      setSelectedGameId(games[0].id);
    }
  }, [games, selectedGameId]);

  // Fetch reviews for the selected game
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
    refetch: refetchReviews,
  } = useQuery<GameReview[]>({
    queryKey: ['reviews', selectedGameId],
    queryFn: () => {
      if (!selectedGameId) return Promise.resolve([]);
      return listReviewsByGame(selectedGameId, { page: 1, limit: 20 });
    },
    enabled: !!selectedGameId,
  })

  // Client-side filter for reviews (commented out as it's not currently used)
  // const filteredReviews = useMemo(() => {
  //   const list = reviews ?? []
  //   const s = search.trim().toLowerCase()
  //   if (!s) return list
  //   return list.filter(r => r.comment?.toLowerCase().includes(s))
  // }, [reviews, search])

  const createMutation = useMutation({
    mutationFn: (payload: CreateGameReviewInput) => createReviewForGame(selectedGameId!, payload),
    onSuccess: () => {
      setComment('')
      setRating(5)
      setIsPublic(true)
      qc.invalidateQueries({ queryKey: ['reviews', { gameId: selectedGameId }] })
    },
  })

  // Star rating component
  function StarRating({ 
    value, 
    onChange, 
    readOnly = false 
  }: { 
    value: number; 
    onChange?: (v: number) => void; 
    readOnly?: boolean;
  }) {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readOnly && onChange?.(star)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={readOnly}
          >
            <Star
              className={`h-5 w-5 ${star <= value ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  }

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!search.trim()) return games;
    const searchTerm = search.toLowerCase();
    return games.filter(game => 
      game.title.toLowerCase().includes(searchTerm) || 
      game.description?.toLowerCase().includes(searchTerm) ||
      game.id.toString().includes(searchTerm)
    );
  }, [games, search]);

  if (gamesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  if (gamesError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Error loading games</h2>
        <p>{gamesErrorData instanceof Error ? gamesErrorData.message : 'Failed to load games. Please try again later.'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Game Reviews</h1>
          <p className="text-sm text-muted-foreground">
            {selectedGameId 
              ? `Viewing reviews for selected game` 
              : 'Select a game to view or add reviews'}
          </p>
        </div>
        
        <div className="w-full md:w-96">
          <Input
            type="search"
            placeholder="Search games by title, description, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No games found. Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <Card 
            key={game.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGameId === game.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedGameId(prev => prev === game.id ? null : game.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{game.title}</CardTitle>
              {game.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {game.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ID: {game.id}</span>
                <button 
                  className="text-primary hover:underline text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGameId(prev => prev === game.id ? null : game.id);
                  }}
                >
                  {selectedGameId === game.id ? 'Hide Reviews' : 'View Reviews'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        )}
      </div>
      
      {/* Reviews Section */}
      {selectedGameId && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Reviews for {games.find(g => g.id === selectedGameId)?.title || 'Selected Game'}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedGameId(null)}
              className="md:hidden"
            >
              Back to Games
            </Button>
          </div>

          {reviewsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : reviewsError ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-medium">Error loading reviews</h3>
              </div>
              <p className="text-sm">
                Failed to load reviews. Please try again.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => refetchReviews()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Review List */}
              {reviews.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {String(review.userId) === user?.uid 
                                ? 'Your Review' 
                                : `Review by User #${review.userId}`}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                              {!review.isPublic && ' • Private'}
                            </p>
                          </div>
                          <StarRating value={review.rating} readOnly />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-sm whitespace-pre-line">{review.comment}</p>
                      </CardContent>
                      {String(review.userId) === user?.uid && (
                        <CardFooter className="flex justify-end gap-2 pt-2 border-t">
                          <Button variant="outline" size="sm" disabled>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" disabled>
                            Delete
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}

              {/* Add Review Form */}
              {user ? (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                  </CardHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (rating && comment.trim()) {
                        createMutation.mutate({ rating, comment, isPublic });
                      }
                    }}
                  >
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-3">
                          <StarRating 
                            value={rating} 
                            onChange={setRating}
                          />
                          <span className="text-sm text-muted-foreground">
                            {rating} out of 5
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label 
                          htmlFor="comment" 
                          className="text-sm font-medium leading-none"
                        >
                          Your Review
                        </label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts about this game..."
                          className="w-full min-h-[120px] rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>Make this review public</span>
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || !rating || !comment.trim()}
                        className="w-full sm:w-auto"
                      >
                        {createMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                            Submit Review
                          </>
                        )}
                      </Button>
                      {createMutation.isError && (
                        <p className="ml-4 text-sm text-red-500">
                          {(createMutation.error as Error).message || 'Failed to submit review'}
                        </p>
                      )}
                    </CardFooter>
                  </form>
                </Card>
              ) : (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Want to leave a review?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Please sign in to share your thoughts about this game.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        // You can add your sign-in logic here
                        console.log('Redirect to sign in');
                      }}
                    >
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
