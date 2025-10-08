package org.example.gamerscove.services.impl;

import org.example.gamerscove.domain.entities.UserEntity;
import org.example.gamerscove.repositories.UserRepository;
import org.example.gamerscove.services.UserService;
import org.slf4j.*;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserEntity createUser(UserEntity userEntity) {
        logger.info("=== CREATE USER REQUEST ===");
        logger.info("Creating user with Firebase UID: {}", userEntity.getFirebaseUid());
        logger.info("Username: {}", userEntity.getUsername());
        logger.info("Email: {}", userEntity.getEmail());
        logger.info("Bio: {}", userEntity.getBio());
        logger.info("Avatar URL: {}", userEntity.getAvatarUrl());

        if (userEntity.getPreferredPlatforms() != null) {
            logger.info("Preferred Platforms: {}", String.join(", ", userEntity.getPreferredPlatforms()));
        }

        if (userEntity.getFavoriteGames() != null) {
            logger.info("Favorite Games: {}", String.join(", ", userEntity.getFavoriteGames()));
        }

        logger.info("Gamertags: {}", userEntity.getGamertags());
        logger.info("Gamertags Visibility: {}", userEntity.getGamertagsVisibility());

        UserEntity savedUser = userRepository.save(userEntity);
        logger.info("User created successfully with ID: {}", savedUser.getId());
        logger.info("============================");

        return savedUser;
    }

    @Override
    public Optional<UserEntity> findByFirebaseUid(String firebaseUid) {
        logger.info("=== FIND USER BY FIREBASE UID ===");
        logger.info("Searching for user with Firebase UID: {}", firebaseUid);

        Optional<UserEntity> user = userRepository.findByFirebaseUid(firebaseUid);
        if (user.isPresent()) {
            logger.info("User found: {}", user.get().getUsername());
        } else {
            logger.info("No user found with Firebase UID: {}", firebaseUid);
        }
        logger.info("=================================");

        return user;
    }

    @Override
    public Optional<UserEntity> findByUsername(String username) {
        logger.info("=== FIND USER BY USERNAME ===");
        logger.info("Searching for user with username: {}", username);

        Optional<UserEntity> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            logger.info("User found with ID: {}", user.get().getId());
        } else {
            logger.info("No user found with username: {}", username);
        }
        logger.info("==============================");

        return user;
    }

    @Override
    public Optional<UserEntity> findById(Long id) {
        logger.info("=== FIND USER BY ID ===");
        logger.info("Searching for user with ID: {}", id);

        Optional<UserEntity> user = userRepository.findById(id);
        if (user.isPresent()) {
            logger.info("User found: {}", user.get().getUsername());
        } else {
            logger.info("No user found with ID: {}", id);
        }
        logger.info("=======================");

        return user;
    }

    @Override
    public UserEntity updateUser(UserEntity userEntity) {
        logger.info("=== UPDATE USER REQUEST ===");
        logger.info("Updating user with ID: {}", userEntity.getId());
        logger.info("New data - Username: {}", userEntity.getUsername());
        logger.info("New data - Bio: {}", userEntity.getBio());

        UserEntity updatedUser = userRepository.save(userEntity);
        logger.info("User updated successfully");
        logger.info("===========================");

        return updatedUser;
    }
}
