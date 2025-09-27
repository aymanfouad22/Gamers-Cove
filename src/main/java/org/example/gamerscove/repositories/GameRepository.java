package org.example.gamerscove.repositories;

import org.example.gamerscove.domain.entities.GameEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface GameRepository extends CrudRepository<GameEntity, Long> {
    Optional<GameEntity> findByTitle(String title);
}
