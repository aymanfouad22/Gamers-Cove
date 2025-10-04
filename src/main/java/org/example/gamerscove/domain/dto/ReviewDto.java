package org.example.gamerscove.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    
    // Accept userId and gameId from JSON
    @JsonProperty("userId")
    private Long userIdInput;
    
    @JsonProperty("gameId")
    private Long gameIdInput;

    @com.fasterxml.jackson.annotation.JsonIgnore
    public Long getUserId() {
        if (userIdInput != null) return userIdInput;
        return user != null ? user.getId() : null;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public Long getGameId() {
        if (gameIdInput != null) return gameIdInput;
        return game != null ? game.getId() : null;
    }
}
