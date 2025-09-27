package org.example.gamerscove.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "game_id", nullable = false)
    private Long gameId;

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

    // Default constructor
    public ReviewEntity() {
    }

    // Constructor with required fields
    public ReviewEntity(Long userId, Long gameId, Integer rating, String content) {
        this.userId = userId;
        this.gameId = gameId;
        this.rating = rating;
        this.content = content;
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
                ", userId=" + userId +
                ", gameId=" + gameId +
                ", rating=" + rating +
                ", content='" + getContentPreview() + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}