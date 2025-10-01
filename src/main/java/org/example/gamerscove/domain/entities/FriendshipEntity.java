package org.example.gamerscove.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "friendships")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Optimized: Use actual foreign key relationships
    @JoinColumn(name = "requester_id", nullable = false)
    private Long requesterId;

    @JoinColumn(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10, nullable = false)
    private FriendshipStatus status = FriendshipStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private java.time.LocalDateTime createdAt;

    public enum FriendshipStatus {
        PENDING("pending"),
        ACCEPTED("accepted"),
        DECLINED("declined");

        private final String value;

        FriendshipStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    // Constructor with UserEntity objects
    public FriendshipEntity(Long requester, Long receiver) {
        this.requesterId = requester;
        this.receiverId = receiver;
        this.status = FriendshipStatus.PENDING;
    }

    // Helper methods
    public boolean isAccepted() {
        return status == FriendshipStatus.ACCEPTED;
    }

    public boolean isPending() {
        return status == FriendshipStatus.PENDING;
    }

    public boolean isDeclined() {
        return status == FriendshipStatus.DECLINED;
    }

    // Check if a user is involved in this friendship
    public boolean involvesUser(Long userId) {
        return userId.equals(getRequesterId()) || userId.equals(getReceiverId());
    }

    // Get the other user entity
    public Long getOtherUser(Long userId) {
        if (userId.equals(getRequesterId())) {
            return receiverId;
        } else if (userId.equals(getReceiverId())) {
            return requesterId;
        }
        throw new IllegalArgumentException("User " + userId + " is not part of this friendship");
    }

    @Override
    public String toString() {
        return "Friendship{" +
                "id=" + id +
                ", requesterId=" + getRequesterId() +
                ", receiverId=" + getReceiverId() +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}