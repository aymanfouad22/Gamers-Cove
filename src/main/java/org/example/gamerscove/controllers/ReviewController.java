package org.example.gamerscove.controllers;

import org.example.gamerscove.domain.dto.ReviewDto;
import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.domain.entities.ReviewEntity;
import org.example.gamerscove.domain.entities.UserEntity;
import org.example.gamerscove.mappers.Mapper;
import org.example.gamerscove.services.GameService;
import org.example.gamerscove.services.ReviewService;
import org.example.gamerscove.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;
    private final UserService userService;
    private final GameService gameService;
    private final Mapper<ReviewEntity, ReviewDto> reviewMapper;

    public ReviewController(ReviewService reviewService,
                            UserService userService,
                            GameService gameService,
                            Mapper<ReviewEntity, ReviewDto> reviewMapper) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.gameService = gameService;
        this.reviewMapper = reviewMapper;
    }

    // Create a new review
    @PostMapping(path = "/reviews")
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewDto reviewDto) {
        logger.info("=== POST /api/reviews ENDPOINT CALLED ===");
        logger.info("Creating review for game ID: {} by user ID: {}", reviewDto.getGameId(), reviewDto.getUserId());
        logger.info("Rating: {}/10", reviewDto.getRating());
        logger.info("========================================");

        try {
            // Validate that user and game exist
            Optional<UserEntity> user = userService.findById(reviewDto.getUserId());
            Optional<GameEntity> game = gameService.findById(reviewDto.getGameId());

            if (user.isEmpty()) {
                logger.warn("User not found with ID: {}", reviewDto.getUserId());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            if (game.isEmpty()) {
                logger.warn("Game not found with ID: {}", reviewDto.getGameId());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Convert DTO to Entity and set relationships
            ReviewEntity reviewEntity = reviewMapper.mapFrom(reviewDto);
            reviewEntity.setUser(user.get());
            reviewEntity.setGame(game.get());

            // Save the review
            ReviewEntity savedReview = reviewService.createReviewEntity(reviewEntity);
            ReviewDto savedReviewDto = reviewMapper.mapTo(savedReview);

            logger.info("Review created successfully with ID: {}", savedReview.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReviewDto);

        } catch (Exception e) {
            logger.error("Error creating review: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Update an existing review
    @PutMapping(path = "/reviews/{reviewId}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable("reviewId") Long reviewId,
                                                  @RequestBody ReviewDto reviewDto) {
        logger.info("=== PUT /api/reviews/{} ENDPOINT CALLED ===", reviewId);
        logger.info("Updating review with ID: {}", reviewId);
        logger.info("New rating: {}/10", reviewDto.getRating());
        logger.info("==========================================");

        try {
            // Set the ID from path variable
            reviewDto.setId(reviewId);

            // Validate that user and game exist
            Optional<UserEntity> user = userService.findById(reviewDto.getUserId());
            Optional<GameEntity> game = gameService.findById(reviewDto.getGameId());

            if (user.isEmpty() || game.isEmpty()) {
                logger.warn("User or Game not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Convert and update
            ReviewEntity reviewEntity = reviewMapper.mapFrom(reviewDto);
            reviewEntity.setUser(user.get());
            reviewEntity.setGame(game.get());

            ReviewEntity updatedReview = reviewService.updateReviewEntity(reviewEntity);
            ReviewDto updatedReviewDto = reviewMapper.mapTo(updatedReview);

            logger.info("Review updated successfully");
            return ResponseEntity.ok(updatedReviewDto);

        } catch (IllegalArgumentException e) {
            logger.error("Review not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating review: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete a review
    @DeleteMapping(path = "/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable("reviewId") Long reviewId) {
        logger.info("=== DELETE /api/reviews/{} ENDPOINT CALLED ===", reviewId);
        logger.info("Deleting review with ID: {}", reviewId);
        logger.info("=============================================");

        try {
            // Create a ReviewEntity with just the ID for deletion
            ReviewEntity reviewEntity = new ReviewEntity();
            reviewEntity.setId(reviewId);

            reviewService.deleteReviewEntity(reviewEntity);
            logger.info("Review deleted successfully");
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            logger.error("Error deleting review: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Get all reviews for a specific game
    @GetMapping(path = "/games/{gameId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsForGame(@PathVariable("gameId") Long gameId) {
        logger.info("=== GET /api/games/{}/reviews ENDPOINT CALLED ===", gameId);
        logger.info("Fetching all reviews for game ID: {}", gameId);
        logger.info("================================================");

        try {
            List<ReviewEntity> reviews = reviewService.findAllReviewsForGame_Id(gameId);
            List<ReviewDto> reviewDtos = reviews.stream()
                    .map(reviewMapper::mapTo)
                    .collect(Collectors.toList());

            logger.info("Found {} reviews for game ID: {}", reviewDtos.size(), gameId);
            return ResponseEntity.ok(reviewDtos);

        } catch (Exception e) {
            logger.error("Error fetching reviews for game: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all reviews by a specific user
    @GetMapping(path = "/users/{userId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsByUser(@PathVariable("userId") Long userId) {
        logger.info("=== GET /api/users/{}/reviews ENDPOINT CALLED ===", userId);
        logger.info("Fetching all reviews by user ID: {}", userId);
        logger.info("================================================");

        try {
            List<ReviewEntity> reviews = reviewService.findAllReviewsForUser_Id(userId);
            List<ReviewDto> reviewDtos = reviews.stream()
                    .map(reviewMapper::mapTo)
                    .collect(Collectors.toList());

            logger.info("Found {} reviews by user ID: {}", reviewDtos.size(), userId);
            return ResponseEntity.ok(reviewDtos);

        } catch (Exception e) {
            logger.error("Error fetching reviews by user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Get a specific review by ID
    @GetMapping(path = "/reviews/{reviewId}")
    public ResponseEntity<ReviewDto> getReviewById(@PathVariable("reviewId") Long reviewId) {
        logger.info("=== GET /api/reviews/{} ENDPOINT CALLED ===", reviewId);
        logger.info("Fetching review with ID: {}", reviewId);
        logger.info("==========================================");

        try {
            // Note: You'll need to add findById to ReviewService
            // For now, this is a placeholder
            logger.warn("findById not implemented in ReviewService yet");
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();

        } catch (Exception e) {
            logger.error("Error fetching review: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}