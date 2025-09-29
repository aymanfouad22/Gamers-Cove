package org.example.gamerscove.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_review_user"))
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false, foreignKey = @ForeignKey(name = "fk_review_game"))
    private GameEntity game;

    @NotNull
    @Min(value = 1, message = "Rating must be between 1 and 10")
    @Max(value = 10, message = "Rating must be between 1 and 10")
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @NotNull
    @NotBlank(message = "Review content cannot be empty")
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT now()")
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    // Constructor with UserEntity and GameEntity objects
    public ReviewEntity(UserEntity user, GameEntity game, Integer rating, String content) {
        this.user = user;
        this.game = game;
        this.rating = rating;
        this.content = content;
    }

    // Convenience methods to get IDs (for backward compatibility)
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Long getGameId() {
        return game != null ? game.getId() : null;
    }

    public void setRating(Integer rating) {
        if (rating != null && (rating < 1 || rating > 10)) {
            throw new IllegalArgumentException("Rating must be between 1 and 10");
        }
        this.rating = rating;
    }

    public String getRatingCategory() {
        if (rating == null) return "No Rating";
        if (rating >= 9) return "Excellent";
        if (rating >= 7) return "Good";
        if (rating >= 5) return "Average";
        if (rating >= 3) return "Poor";
        return "Terrible";
    }

    // Get content preview (first 100 characters)
    public String getContentPreview() {
        if (content == null) return "";
        if (content.length() <= 100) return content;
        return content.substring(0, 97) + "...";
    }

    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", userId=" + getUserId() +
                ", gameId=" + getGameId() +
                ", rating=" + rating +
                ", content='" + getContentPreview() + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}