package org.example.gamerscove.services.impl;

import org.example.gamerscove.domain.entities.ReviewEntity;
import org.example.gamerscove.repositories.ReviewRepository;
import org.example.gamerscove.services.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Optional;


import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);
    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public ReviewEntity createReviewEntity(ReviewEntity reviewEntity) {
        logger.info("=== CREATE REVIEW REQUEST ===");
        logger.info("Creating review for game ID: {} by user ID: {}",
                reviewEntity.getGameId(), reviewEntity.getUserId());
        logger.info("Rating: {}/10", reviewEntity.getRating());
        logger.info("Content preview: {}", reviewEntity.getContentPreview());

        ReviewEntity savedReview = reviewRepository.save(reviewEntity);
        logger.info("Review created successfully with ID: {}", savedReview.getId());
        logger.info("============================");

        return savedReview;
    }

    @Override
    public ReviewEntity updateReviewEntity(ReviewEntity reviewEntity) {
        logger.info("=== UPDATE REVIEW REQUEST ===");
        logger.info("Updating review with ID: {}", reviewEntity.getId());
        logger.info("New rating: {}/10", reviewEntity.getRating());
        logger.info("New content preview: {}", reviewEntity.getContentPreview());

        if (reviewEntity.getId() == null) {
            logger.error("Cannot update review without an ID");
            throw new IllegalArgumentException("Review ID cannot be null for update operation");
        }

        Optional<ReviewEntity> existingReview = reviewRepository.findById(reviewEntity.getId());
        if (existingReview.isEmpty()) {
            logger.error("Review with ID {} not found", reviewEntity.getId());
            throw new IllegalArgumentException("Review not found with ID: " + reviewEntity.getId());
        }

        ReviewEntity updatedReview = reviewRepository.save(reviewEntity);
        logger.info("Review updated successfully");
        logger.info("============================");

        return updatedReview;
    }

    @Override
    public void deleteReviewEntity(ReviewEntity reviewEntity) {
        logger.info("=== DELETE REVIEW REQUEST ===");
        logger.info("Deleting review with ID: {}", reviewEntity.getId());

        if (reviewEntity.getId() == null) {
            logger.error("Cannot delete review without an ID");
            throw new IllegalArgumentException("Review ID cannot be null for delete operation");
        }

        reviewRepository.delete(reviewEntity);
        logger.info("Review deleted successfully");
        logger.info("============================");
    }

    @Override
    public List<ReviewEntity> findAllReviewsForGame_Id(Long id) {
        logger.info("=== FIND REVIEWS FOR GAME ===");
        logger.info("Searching for all reviews for game ID: {}", id);

        List<ReviewEntity> reviews = reviewRepository.findByGame_Id(id);
        logger.info("Found {} reviews for game ID: {}", reviews.size(), id);
        logger.info("============================");

        return reviews;
    }

    @Override
    public List<ReviewEntity> findAllReviewsForUser_Id(Long id) {
        logger.info("=== FIND REVIEWS FOR USER ===");
        logger.info("Searching for all reviews by user ID: {}", id);

        List<ReviewEntity> reviews = reviewRepository.findByUser_Id(id);
        logger.info("Found {} reviews by user ID: {}", reviews.size(), id);
        logger.info("============================");

        return reviews;
    }
}
