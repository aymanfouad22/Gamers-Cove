package org.example.gamerscove.services;

import org.example.gamerscove.domain.entities.GameEntity;

import java.util.List;
import java.util.Optional;

public interface GameService {
    GameEntity createGameEntity(GameEntity gameEntity);
    Optional<GameEntity> findById(Long id);
    Optional<GameEntity> findTitle(String title);
    List<GameEntity> findAll();
}
