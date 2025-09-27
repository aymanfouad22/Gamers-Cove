package org.example.gamerscove.services;

import org.example.gamerscove.domain.entities.UserEntity;

import java.util.Optional;

public interface UserService {

    UserEntity createUser(UserEntity userEntity);
    Optional<UserEntity> findByFirebaseUid(String firebaseUid);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findById(Long id);
    UserEntity updateUser(UserEntity userEntity);
}
