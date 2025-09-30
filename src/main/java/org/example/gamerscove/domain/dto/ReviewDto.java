package org.example.gamerscove.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.domain.entities.UserEntity;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private UserEntity user;
    private GameEntity game;
    private Integer rating;
    private String content;
    private LocalDateTime createdAt;

    public Long getUserId() {
        return user.getId();
    }

    public Long getGameId() {
        return game.getId();
    }
}
