import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listReviewsByGame,
  createReviewForGame,
  type GameReview,
  type CreateGameReviewInput,
} from '@/services/reviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/context/AuthContext'
import { Search, Plus, Star } from 'lucide-react'

export default function GameReviews() {
  const { id } = useParams<{ id: string }>()
  const gameId = Number(id)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Fetch reviews for this game (public GET)
  const {
    data: reviews,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<GameReview[]>({
    queryKey: ['reviews', { gameId }],
    queryFn: () => listReviewsByGame(gameId, { page: 1, limit: 20 }),
    enabled: Number.isFinite(gameId) && gameId > 0,
  })

  // Local search state (client-side filter)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReviews = useMemo(() => {
    const list = reviews ?? []
    const s = searchQuery.trim().toLowerCase()
    if (!s) return list
    return list.filter((r) => r.comment?.toLowerCase().includes(s))
  }, [reviews, searchQuery])

  // Create review (protected POST by gameId)
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [isPublic, setIsPublic] = useState<boolean>(true)

  const createMutation = useMutation({
    mutationFn: (payload: CreateGameReviewInput) => createReviewForGame(gameId, payload),
    onSuccess: () => {
      setComment('')
      setRating(5)
      setIsPublic(true)
      queryClient.invalidateQueries({ queryKey: ['reviews', { gameId }] })
    },
  })

  function renderRating(value: number) {
    const n = Math.max(0, Math.min(5, Math.floor(value)))
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < n ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    )
  }

  if (!Number.isFinite(gameId) || gameId <= 0) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Invalid game ID.</CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>Loading reviews…</CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="m-6 border-destructive/40">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="text-red-500">
          Error loading reviews
          <div className="text-xs mt-1">{(error as Error).message}</div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Game reviews for #{gameId}</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reviews…"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Create Review (auth only) */}
      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>Write a review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <label htmlFor="rating" className="w-24 text-sm text-muted-foreground">
                Rating
              </label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="max-w-[120px]"
              />
            </div>

            <div className="flex items-start gap-3">
              <label htmlFor="comment" className="w-24 text-sm text-muted-foreground">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your thoughts…"
                className="flex-1 min-h-[100px] rounded-md border bg-background p-2 text-sm outline-none focus:ring-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="isPublic" className="w-24 text-sm text-muted-foreground">
                Public
              </label>
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => createMutation.mutate({ rating, comment, isPublic })}
              disabled={createMutation.isPending || !rating || !comment.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              {createMutation.isPending ? 'Posting…' : 'Post review'}
            </Button>
            {createMutation.isError && (
              <span className="text-red-500 text-sm ml-3">{(createMutation.error as Error).message}</span>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Want to write a review?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Sign in to post a review for this game.</CardContent>
        </Card>
      )}

      {/* List reviews */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No reviews yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Be the first to review this game!</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {String(review.userId) === user?.uid ? 'Your Review' : `Review #${review.id}`}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      {!review.isPublic && ' • Private'}
                    </p>
                  </div>
                  {renderRating(review.rating)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm">{review.comment}</p>
              </CardContent>
              {String(review.userId) === user?.uid && (
                <CardFooter className="flex justify-end gap-2 pt-2 border-t">
                  {/* Wire these when edit/delete endpoints are ready */}
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
    </div>
  )}
