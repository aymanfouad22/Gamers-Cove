import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Star, MessageSquare, User, StarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { createReviewForGame } from '@/services/reviews';
import { getGame } from '@/services/games';
import { listReviewsByGame } from '@/services/reviews';
import type { GameDto } from '@/services/games';
import type { GameReview } from '@/services/reviews';

export default function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameDto | null>(null);
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch game details
  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const gameData = await getGame(Number(id));
        setGame(gameData);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError('Failed to load game details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    if (!id) return;
    
    try {
      setReviewsLoading(true);
      const reviewsData = await listReviewsByGame(Number(id));
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // Don't show error to user for reviews, just log it
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createReviewForGame(Number(id), {
        rating,
        comment,
        isPublic: true
      });
      
      // Refresh reviews
      await fetchReviews();
      
      // Reset form
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      
      toast({
        title: 'Success',
        description: 'Review submitted successfully!',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
        </Button>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Game not found</h2>
          <p className="text-muted-foreground">The requested game could not be loaded.</p>
          <Button className="mt-4" onClick={() => navigate('/games')}>
            Browse All Games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
      </Button>
      
      <div className="grid gap-8">
        {/* Game Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {game.coverImageUrl ? (
                <img 
                  src={game.coverImageUrl} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No cover image</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{game.title}</h1>
              {game.releaseDate && (
                <span className="text-sm text-muted-foreground">
                  ({new Date(game.releaseDate).getFullYear()})
                </span>
              )}
            </div>
            
            {game.genres && game.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {game.genres.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              {game.developer && (
                <div>
                  <h3 className="font-medium">Developer</h3>
                  <p className="text-muted-foreground">{game.developer}</p>
                </div>
              )}
              
              {game.publisher && (
                <div>
                  <h3 className="font-medium">Publisher</h3>
                  <p className="text-muted-foreground">{game.publisher}</p>
                </div>
              )}
              
              {game.releaseDate && (
                <div>
                  <h3 className="font-medium">Release Date</h3>
                  <p className="text-muted-foreground">
                    {new Date(game.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {game.platforms && game.platforms.length > 0 && (
                <div>
                  <h3 className="font-medium">Platforms</h3>
                  <p className="text-muted-foreground">{game.platforms.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Game Description */}
        {game.description && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-muted-foreground whitespace-pre-line">{game.description}</p>
          </div>
        )}
        
        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowReviewForm(!showReviewForm)}
              disabled={isSubmitting}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>
          
          {showReviewForm && (
            <div className="border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="focus:outline-none"
                      >
                        <StarIcon
                          className={`h-6 w-6 ${value <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating} out of 5
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this game..."
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{review.user?.username || `User ${review.userId}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="mt-3 text-muted-foreground">{review.comment || review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review this game!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
