package org.example.gamerscove.repositories;

import org.example.gamerscove.domain.entities.ReviewEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends CrudRepository<ReviewEntity, Long> {

    // Find all reviews by a specific user (a user can review multiple games)
    List<ReviewEntity> findByUser_Id(Long userId);

    // Find all reviews for a specific game (a game can have multiple reviews)
    List<ReviewEntity> findByGame_Id(Long gameId);

    // Find review by username (if you need this - depends on your use case)
    Optional<ReviewEntity> findByUsername(String username);

    // Optional: Find a specific review by both game and user (to check if user already reviewed a game)
    Optional<ReviewEntity> findByUser_IdAndGame_Id(Long userId, Long gameId);
}