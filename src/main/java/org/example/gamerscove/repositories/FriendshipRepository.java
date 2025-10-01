package org.example.gamerscove.repositories;

import org.example.gamerscove.domain.entities.FriendshipEntity;
import org.example.gamerscove.domain.entities.FriendshipEntity.FriendshipStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends CrudRepository<FriendshipEntity, Long> {

    // Find all friendships where user is either requester or receiver
    List<FriendshipEntity> findAllByRequesterIdOrReceiverId(Long requesterId, Long receiverId);

    // Find friendships by receiver and status
    List<FriendshipEntity> findByReceiverIdAndStatus(Long receiverId, FriendshipStatus status);

    // Find a specific friendship between two users with specific status
    Optional<FriendshipEntity> findByRequesterIdAndReceiverIdAndStatus(
            Long requesterId, Long receiverId, FriendshipStatus status);

    // Get friend IDs for a user (only accepted friendships)
    @Query("SELECT CASE " +
            "WHEN f.requesterId = :userId THEN f.receiverId " +
            "ELSE f.requesterId END " +
            "FROM FriendshipEntity f " +
            "WHERE (f.requesterId = :userId OR f.receiverId = :userId) " +
            "AND f.status = 'ACCEPTED'")
    List<Long> findFriendIdsForUser(@Param("userId") Long userId);

}