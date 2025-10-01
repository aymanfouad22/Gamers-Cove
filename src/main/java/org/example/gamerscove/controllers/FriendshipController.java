package org.example.gamerscove.controllers;

import org.example.gamerscove.domain.dto.FriendshipDto;
import org.example.gamerscove.domain.entities.FriendshipEntity;
import org.example.gamerscove.mappers.Mapper;
import org.example.gamerscove.services.FriendshipServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private static final Logger logger = LoggerFactory.getLogger(FriendshipController.class);

    private final FriendshipServiceImpl friendshipService;
    private final Mapper<FriendshipEntity, FriendshipDto> friendshipMapper;

    public FriendshipController(FriendshipServiceImpl friendshipService,
                                Mapper<FriendshipEntity, FriendshipDto> friendshipMapper) {
        this.friendshipService = friendshipService;
        this.friendshipMapper = friendshipMapper;
    }

    /**
     * Send a friend request
     * POST /api/friendships/request
     */
    @PostMapping("/request")
    public ResponseEntity<FriendshipDto> sendFriendRequest(@RequestBody Map<String, Long> request) {
        try {
            Long requesterId = request.get("requesterId");
            Long receiverId = request.get("receiverId");

            if (requesterId == null || receiverId == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            logger.info("Received friend request from user {} to user {}", requesterId, receiverId);

            FriendshipEntity friendship = friendshipService.sendFriendRequest(requesterId, receiverId);
            FriendshipDto friendshipDto = friendshipMapper.mapTo(friendship);

            return new ResponseEntity<>(friendshipDto, HttpStatus.CREATED);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Error sending friend request: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Accept a friend request
     * PUT /api/friendships/{id}/accept
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<FriendshipDto> acceptFriendRequest(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            logger.info("User {} accepting friend request {}", userId, id);

            FriendshipEntity friendship = friendshipService.acceptFriendRequest(id, userId);
            FriendshipDto friendshipDto = friendshipMapper.mapTo(friendship);

            return new ResponseEntity<>(friendshipDto, HttpStatus.OK);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Error accepting friend request: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Decline a friend request
     * PUT /api/friendships/{id}/decline
     */
    @PutMapping("/{id}/decline")
    public ResponseEntity<FriendshipDto> declineFriendRequest(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            logger.info("User {} declining friend request {}", userId, id);

            FriendshipEntity friendship = friendshipService.declineFriendRequest(id, userId);
            FriendshipDto friendshipDto = friendshipMapper.mapTo(friendship);

            return new ResponseEntity<>(friendshipDto, HttpStatus.OK);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Error declining friend request: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Remove a friendship or cancel a request
     * DELETE /api/friendships/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFriendship(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            logger.info("User {} removing friendship {}", userId, id);

            friendshipService.removeFriendship(id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            logger.error("Error removing friendship: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all pending friend requests for a user
     * GET /api/friendships/pending?userId={userId}
     */
    @GetMapping("/pending")
    public ResponseEntity<List<FriendshipDto>> getPendingRequests(@RequestParam Long userId) {
        logger.info("Fetching pending requests for user {}", userId);

        List<FriendshipEntity> pendingRequests = friendshipService.getPendingRequests(userId);
        List<FriendshipDto> friendshipDtos = pendingRequests.stream()
                .map(friendshipMapper::mapTo)
                .collect(Collectors.toList());

        return new ResponseEntity<>(friendshipDtos, HttpStatus.OK);
    }

    /**
     * Get all friendships for a user
     * GET /api/friendships/all?userId={userId}
     */
    @GetMapping("/all")
    public ResponseEntity<List<FriendshipDto>> getAllFriendships(@RequestParam Long userId) {
        logger.info("Fetching all friendships for user {}", userId);

        List<FriendshipEntity> friendships = friendshipService.getAllFriendships(userId);
        List<FriendshipDto> friendshipDtos = friendships.stream()
                .map(friendshipMapper::mapTo)
                .collect(Collectors.toList());

        return new ResponseEntity<>(friendshipDtos, HttpStatus.OK);
    }

    /**
     * Get all accepted friends for a user
     * GET /api/friendships/friends?userId={userId}
     */
    @GetMapping("/friends")
    public ResponseEntity<List<FriendshipDto>> getAcceptedFriends(@RequestParam Long userId) {
        logger.info("Fetching accepted friends for user {}", userId);

        List<FriendshipEntity> friends = friendshipService.getAcceptedFriends(userId);
        List<FriendshipDto> friendshipDtos = friends.stream()
                .map(friendshipMapper::mapTo)
                .collect(Collectors.toList());

        return new ResponseEntity<>(friendshipDtos, HttpStatus.OK);
    }

    /**
     * Get friend IDs for a user
     * GET /api/friendships/friend-ids?userId={userId}
     */
    @GetMapping("/friend-ids")
    public ResponseEntity<List<Long>> getFriendIds(@RequestParam Long userId) {
        logger.info("Fetching friend IDs for user {}", userId);

        List<Long> friendIds = friendshipService.getFriendIds(userId);
        return new ResponseEntity<>(friendIds, HttpStatus.OK);
    }

    /**
     * Get a specific friendship by ID
     * GET /api/friendships/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FriendshipDto> getFriendshipById(@PathVariable Long id) {
        logger.info("Fetching friendship {}", id);

        Optional<FriendshipEntity> friendship = friendshipService.getFriendshipById(id);

        return friendship.map(entity -> {
            FriendshipDto friendshipDto = friendshipMapper.mapTo(entity);
            return new ResponseEntity<>(friendshipDto, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Check if two users are friends
     * GET /api/friendships/check?userId1={userId1}&userId2={userId2}
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFriendship(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        logger.info("Checking friendship between user {} and user {}", userId1, userId2);

        boolean areFriends = friendshipService.areFriends(userId1, userId2);
        return new ResponseEntity<>(Map.of("areFriends", areFriends), HttpStatus.OK);
    }

    /**
     * Check if there's a pending request between two users
     * GET /api/friendships/check-pending?requesterId={requesterId}&receiverId={receiverId}
     */
    @GetMapping("/check-pending")
    public ResponseEntity<Map<String, Boolean>> checkPendingRequest(
            @RequestParam Long requesterId,
            @RequestParam Long receiverId) {
        logger.info("Checking pending request from user {} to user {}", requesterId, receiverId);

        boolean hasPending = friendshipService.hasPendingRequest(requesterId, receiverId);
        return new ResponseEntity<>(Map.of("hasPendingRequest", hasPending), HttpStatus.OK);
    }
}