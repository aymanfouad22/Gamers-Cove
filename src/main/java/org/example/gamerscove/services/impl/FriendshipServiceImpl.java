package org.example.gamerscove.services;

import org.example.gamerscove.domain.entities.FriendshipEntity;
import org.example.gamerscove.domain.entities.FriendshipEntity.FriendshipStatus;
import org.example.gamerscove.repositories.FriendshipRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FriendshipServiceImpl implements FriendshipService {

    private static final Logger logger = LoggerFactory.getLogger(FriendshipServiceImpl.class);

    private final FriendshipRepository friendshipRepository;

    public FriendshipServiceImpl(FriendshipRepository friendshipRepository) {
        this.friendshipRepository = friendshipRepository;
    }

    /**
     * Send a friend request from requester to receiver
     */
    @Transactional
    public FriendshipEntity sendFriendRequest(Long requesterId, Long receiverId) {
        logger.info("User {} sending friend request to user {}", requesterId, receiverId);

        if (requesterId.equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        // Check if friendship already exists in either direction
        Optional<FriendshipEntity> existingRequest = findExistingFriendship(requesterId, receiverId);
        if (existingRequest.isPresent()) {
            FriendshipEntity existing = existingRequest.get();
            throw new IllegalStateException("Friendship already exists with status: " + existing.getStatus());
        }

        FriendshipEntity friendship = new FriendshipEntity(requesterId, receiverId);
        friendship.setStatus(FriendshipStatus.PENDING);

        return friendshipRepository.save(friendship);
    }

    /**
     * Accept a friend request
     */
    @Transactional
    public FriendshipEntity acceptFriendRequest(Long friendshipId, Long userId) {
        logger.info("User {} accepting friend request {}", userId, friendshipId);

        FriendshipEntity friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found with id: " + friendshipId));

        // Verify the user is the receiver
        if (!friendship.getReceiverId().equals(userId)) {
            throw new IllegalArgumentException("Only the receiver can accept the friend request");
        }

        if (!friendship.isPending()) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    /**
     * Decline a friend request
     */
    @Transactional
    public FriendshipEntity declineFriendRequest(Long friendshipId, Long userId) {
        logger.info("User {} declining friend request {}", userId, friendshipId);

        FriendshipEntity friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found with id: " + friendshipId));

        // Verify the user is the receiver
        if (!friendship.getReceiverId().equals(userId)) {
            throw new IllegalArgumentException("Only the receiver can decline the friend request");
        }

        if (!friendship.isPending()) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendship.setStatus(FriendshipStatus.DECLINED);
        return friendshipRepository.save(friendship);
    }

    /**
     * Remove a friendship (unfriend or cancel request)
     */
    @Transactional
    public void removeFriendship(Long friendshipId, Long userId) {
        logger.info("User {} removing friendship {}", userId, friendshipId);

        FriendshipEntity friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found with id: " + friendshipId));

        // Verify the user is involved in this friendship
        if (!friendship.involvesUser(userId)) {
            throw new IllegalArgumentException("User is not part of this friendship");
        }

        friendshipRepository.delete(friendship);
    }

    /**
     * Get all pending friend requests for a user (requests received)
     */
    public List<FriendshipEntity> getPendingRequests(Long userId) {
        logger.debug("Fetching pending requests for user {}", userId);
        return friendshipRepository.findByReceiverIdAndStatus(userId, FriendshipStatus.PENDING);
    }

    /**
     * Get all friendships for a user (as requester or receiver)
     */
    public List<FriendshipEntity> getAllFriendships(Long userId) {
        logger.debug("Fetching all friendships for user {}", userId);
        return friendshipRepository.findAllByRequesterIdOrReceiverId(userId, userId);
    }

    /**
     * Get all accepted friends for a user
     */
    public List<FriendshipEntity> getAcceptedFriends(Long userId) {
        logger.debug("Fetching accepted friends for user {}", userId);
        List<FriendshipEntity> allFriendships = friendshipRepository.findAllByRequesterIdOrReceiverId(userId, userId);
        return allFriendships.stream()
                .filter(FriendshipEntity::isAccepted)
                .toList();
    }

    /**
     * Get friend IDs for a user (only accepted friendships)
     */
    public List<Long> getFriendIds(Long userId) {
        logger.debug("Fetching friend IDs for user {}", userId);
        return friendshipRepository.findFriendIdsForUser(userId);
    }

    /**
     * Get a specific friendship by ID
     */
    public Optional<FriendshipEntity> getFriendshipById(Long friendshipId) {
        return friendshipRepository.findById(friendshipId);
    }

    /**
     * Check if two users are friends (accepted friendship exists)
     */
    public boolean areFriends(Long userId1, Long userId2) {
        Optional<FriendshipEntity> friendship = findExistingFriendship(userId1, userId2);
        return friendship.isPresent() && friendship.get().isAccepted();
    }

    /**
     * Check if a pending request exists between two users
     */
    public boolean hasPendingRequest(Long requesterId, Long receiverId) {
        Optional<FriendshipEntity> friendship = friendshipRepository
                .findByRequesterIdAndReceiverIdAndStatus(requesterId, receiverId, FriendshipStatus.PENDING);
        return friendship.isPresent();
    }

    /**
     * Helper method to find existing friendship in either direction
     */
    private Optional<FriendshipEntity> findExistingFriendship(Long userId1, Long userId2) {
        List<FriendshipEntity> friendships = friendshipRepository
                .findAllByRequesterIdOrReceiverId(userId1, userId1);

        return friendships.stream()
                .filter(f -> f.involvesUser(userId2))
                .findFirst();
    }
}