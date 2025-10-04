package org.example.gamerscove.services;

import org.example.gamerscove.domain.entities.ReviewEntity;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewEntity createReviewEntity(ReviewEntity reviewEntity);
    ReviewEntity updateReviewEntity(ReviewEntity reviewEntity);
    void deleteReviewEntity(ReviewEntity reviewEntity);
    Optional<ReviewEntity> findById(Long id);
    List<ReviewEntity> findAllReviewsForGame_Id(Long id);
    List<ReviewEntity> findAllReviewsForUser_Id(Long id);
}
