package org.example.gamerscove.controllers;

import org.example.gamerscove.config.SecurityUtils;
import org.example.gamerscove.domain.dto.UserDto;
import org.example.gamerscove.domain.entities.UserEntity;
import org.example.gamerscove.mappers.Mapper;
import org.example.gamerscove.services.UserService;
import org.slf4j.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private UserService userService;
    private Mapper<UserEntity, UserDto> userMapper;

    public UserController(UserService userService, Mapper<UserEntity, UserDto> userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping(path = "/users")
    public UserDto createUser(@RequestBody UserDto user) {
        logger.info("=== POST /api/users ENDPOINT CALLED ===");
        logger.info("Received UserDto: {}", user);
        logger.info("======================================");

        UserEntity userEntity = userMapper.mapFrom(user);
        UserEntity savedUserEntity = userService.createUser(userEntity);
        return userMapper.mapTo(savedUserEntity);
    }

    @PutMapping(path = "/users/me")
    public ResponseEntity<UserDto> updateUserInfo(@RequestBody UserDto user) {
        logger.info("=== PUT /api/users/me ENDPOINT CALLED ===");
        logger.info("Received request to update user info: {}", user);
        logger.info("========================================");

        // Get authenticated user's Firebase UID (if auth is enabled)
        String currentUserFirebaseUid = SecurityUtils.getCurrentUserFirebaseUid();
        
        // Verify the user is updating their own profile (if auth is enabled)
        if (currentUserFirebaseUid != null && !currentUserFirebaseUid.equals(user.getFirebaseUid())) {
            logger.warn("⚠️ User {} attempted to update profile of user {}", 
                       currentUserFirebaseUid, user.getFirebaseUid());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null);
        }

        Optional<UserEntity> existingUser = userService.findByFirebaseUid(user.getFirebaseUid());
        if (existingUser.isPresent()) {
            UserEntity userEntity = userMapper.mapFrom(user);
            userEntity.setId(existingUser.get().getId());

            UserEntity updatedUser = userService.updateUser(userEntity);
            UserDto updatedUserDto = userMapper.mapTo(updatedUser);

            logger.info("✅ User updated successfully: {}", updatedUserDto.getUsername());
            return ResponseEntity.ok(updatedUserDto);
        } else {
            logger.warn("User not found for update with Firebase UID: {}", user.getFirebaseUid());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/users/{userId}/favorite_games")
    public ResponseEntity<Long[]> getUserFavoriteGames(@PathVariable("userId") Long userId) {
        logger.info("=== GET /api/users/{}/favorite_games ENDPOINT CALLED ===", userId);
        logger.info("Fetching favorite games for user ID: {}", userId);
        logger.info("======================================================");

        Optional<UserEntity> user = userService.findById(userId);
        if (user.isPresent()) {
            // Verify the authenticated user is requesting their own favorites (if auth is enabled)
            String currentUserFirebaseUid = SecurityUtils.getCurrentUserFirebaseUid();
            if (currentUserFirebaseUid != null && !SecurityUtils.isResourceOwner(user.get().getFirebaseUid())) {
                logger.warn("⚠️ User {} attempted to access favorites of user {}", 
                           currentUserFirebaseUid, user.get().getFirebaseUid());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Long[] favoriteGameIds = user.get().getFavoriteGameIds();
            logger.info("✅ Found {} favorite games for user {}",
                    favoriteGameIds != null ? favoriteGameIds.length : 0,
                    user.get().getUsername());
            if (favoriteGameIds != null) {
                logger.info("Favorite game IDs: {}", java.util.Arrays.toString(favoriteGameIds));
            }
            return ResponseEntity.ok(favoriteGameIds);
        } else {
            logger.warn("User not found with ID: {}", userId);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/users/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable("username") String username) {
        logger.info("=== GET /api/users/username/{} ENDPOINT CALLED ===", username);
        logger.info("Fetching user by username: {}", username);
        logger.info("=================================================");

        Optional<UserEntity> userFound = userService.findByUsername(username);

        if (userFound.isPresent()) {
            UserDto userDto = userMapper.mapTo(userFound.get());
            logger.info("Found user: {}", userDto.getUsername());
            return ResponseEntity.ok(userDto);
        } else {
            logger.warn("User not found with username: {}", username);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/users/firebase/{firebaseUid}")
    public ResponseEntity<UserDto> getUserByFirebaseUid(@PathVariable("firebaseUid") String firebaseUid) {
        logger.info("=== GET /api/users/firebase/{} ENDPOINT CALLED ===", firebaseUid);
        logger.info("Fetching user by Firebase UID: {}", firebaseUid);
        logger.info("===================================================");

        Optional<UserEntity> userFound = userService.findByFirebaseUid(firebaseUid);

        if (userFound.isPresent()) {
            UserDto userDto = userMapper.mapTo(userFound.get());
            logger.info("Found user: {}", userDto.getUsername());
            return ResponseEntity.ok(userDto);
        } else {
            logger.warn("User not found with Firebase UID: {}", firebaseUid);
            return ResponseEntity.notFound().build();
        }
    }
}