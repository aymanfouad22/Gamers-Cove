package org.example.gamerscove.services;

import org.example.gamerscove.domain.entities.ReviewEntity;

import java.util.List;

public interface ReviewService {
    ReviewEntity createReviewEntity(ReviewEntity reviewEntity);
    ReviewEntity updateReviewEntity(ReviewEntity reviewEntity);
    void deleteReviewEntity(ReviewEntity reviewEntity);
    List<ReviewEntity> findAllReviewsForGame_Id(Long id);
    List<ReviewEntity> findAllReviewsForUser_Id(Long id);
}
