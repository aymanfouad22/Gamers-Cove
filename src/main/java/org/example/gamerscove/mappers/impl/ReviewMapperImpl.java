package org.example.gamerscove.mappers.impl;

import org.example.gamerscove.domain.dto.ReviewDto;
import org.example.gamerscove.domain.entities.ReviewEntity;
import org.example.gamerscove.mappers.Mapper;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapperImpl implements Mapper<ReviewEntity, ReviewDto> {

    @Override
    public ReviewDto mapTo(ReviewEntity reviewEntity) {
        return ReviewDto.builder()
                .id(reviewEntity.getId())
                .user(reviewEntity.getUser())
                .game(reviewEntity.getGame())
                .rating(reviewEntity.getRating())
                .content(reviewEntity.getContent())
                .createdAt(reviewEntity.getCreatedAt())
                .build();
    }

    @Override
    public ReviewEntity mapFrom(ReviewDto reviewDto) {
        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setId(reviewDto.getId());
        reviewEntity.setRating(reviewDto.getRating());
        reviewEntity.setContent(reviewDto.getContent());
        return reviewEntity;
    }
}