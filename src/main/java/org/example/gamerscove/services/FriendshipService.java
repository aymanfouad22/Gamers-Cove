package org.example.gamerscove.services;

import org.example.gamerscove.domain.entities.FriendshipEntity;

import java.util.List;
import java.util.Optional;

public interface FriendshipService {


    FriendshipEntity sendFriendRequest(Long requesterId, Long receiverId);
    FriendshipEntity acceptFriendRequest(Long friendshipId, Long userId);
    FriendshipEntity declineFriendRequest(Long friendshipId, Long userId);
    void removeFriendship(Long friendshipId, Long userId);
    List<FriendshipEntity> getPendingRequests(Long userId);
    List<FriendshipEntity> getAllFriendships(Long userId);
    List<FriendshipEntity> getAcceptedFriends(Long userId);
    List<Long> getFriendIds(Long userId);
    Optional<FriendshipEntity> getFriendshipById(Long friendshipId);
    boolean areFriends(Long userId1, Long userId2);
    boolean hasPendingRequest(Long requesterId, Long receiverId);
}