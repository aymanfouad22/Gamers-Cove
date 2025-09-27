package org.example.gamerscove.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "friendships")
@Getter @Setter
public class FriendshipEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requester_id", nullable = false)
    private Long requesterId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10, columnDefinition = "varchar(10) default 'pending'")
    private FriendshipStatus status = FriendshipStatus.PENDING;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT now()")
    @org.hibernate.annotations.CreationTimestamp
    private java.time.LocalDateTime createdAt;

    public enum FriendshipStatus {
        PENDING("pending"),
        ACCEPTED("accepted"),
        DECLINED("declined"),
        BLOCKED("blocked");

        private final String value;

        FriendshipStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    // Constructors
    public FriendshipEntity() {
    }

    public FriendshipEntity(Long requesterId, Long receiverId) {
        this.requesterId = requesterId;
        this.receiverId = receiverId;
        this.status = FriendshipStatus.PENDING;
    }

    // Helper methods
    public boolean isAccepted() {
        return status == FriendshipStatus.ACCEPTED;
    }

    public boolean isPending() {
        return status == FriendshipStatus.PENDING;
    }

    public boolean isBlocked() {
        return status == FriendshipStatus.BLOCKED;
    }

    public boolean isDeclined() {
        return status == FriendshipStatus.DECLINED;
    }

    // Check if a user is involved in this friendship
    public boolean involvesUser(Long userId) {
        return userId.equals(requesterId) || userId.equals(receiverId);
    }

    // Get the other user in the friendship
    public Long getOtherUserId(Long userId) {
        if (userId.equals(requesterId)) {
            return receiverId;
        } else if (userId.equals(receiverId)) {
            return requesterId;
        }
        throw new IllegalArgumentException("User " + userId + " is not part of this friendship");
    }

    @Override
    public String toString() {
        return "Friendship{" +
                "id=" + id +
                ", requesterId=" + requesterId +
                ", receiverId=" + receiverId +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}

