package org.example.gamerscove.repositories;

import org.springframework.data.repository.CrudRepository;
import org.example.gamerscove.domain.entities.UserEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, Long> {
    Optional<UserEntity> findByFirebaseUid(String firebaseUid);
    Optional<UserEntity> findByUsername(String username);
}
