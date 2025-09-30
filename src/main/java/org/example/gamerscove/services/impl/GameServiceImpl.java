package org.example.gamerscove.services.impl;

import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.repositories.GameRepository;
import org.example.gamerscove.services.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;


@Service
public class GameServiceImpl implements GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameServiceImpl.class);
    private final GameRepository gameRepository;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public GameEntity createGameEntity(GameEntity gameEntity) {
        logger.info("=== CREATE GAME REQUEST ===");
        logger.info("Creating game with external API ID: {}", gameEntity.getExternalApiId());
        logger.info("Title: {}", gameEntity.getTitle());
        logger.info("Description: {}", gameEntity.getDescription());
        logger.info("Cover Image URL: {}", gameEntity.getCoverImageUrl());
        logger.info("Release Date: {}", gameEntity.getReleaseDate());

        if (gameEntity.getPlatforms() != null) {
            logger.info("Platforms: {}", String.join(", ", gameEntity.getPlatforms()));
        }

        if (gameEntity.getGenres() != null) {
            logger.info("Genres: {}", String.join(", ", gameEntity.getGenres()));
        }

        GameEntity savedGame = gameRepository.save(gameEntity);
        logger.info("Game created successfully with ID: {}", savedGame.getId());
        logger.info("============================");

        return savedGame;
    }

    @Override
    public Optional<GameEntity> findById(Long id) {
        logger.info("=== FIND GAME BY ID ===");
        logger.info("Searching for game with ID: {}", id);

        Optional<GameEntity> foundGame = gameRepository.findById(id);
        if (foundGame.isPresent()) {
            logger.info("Game found: {}", foundGame.get().getTitle());
        } else {
            logger.info("No game found with ID: {}", id);
        }
        logger.info("=======================");

        return foundGame;
    }

    @Override
    public Optional<GameEntity> findTitle(String title) {
        logger.info("=== FIND GAME BY TITLE ===");
        logger.info("Searching for game with title: {}", title);

        Optional<GameEntity> foundGame = gameRepository.findByTitle(title);
        if (foundGame.isPresent()) {
            logger.info("Game found with ID: {}", foundGame.get().getId());
        } else {
            logger.info("No game found with title: {}", title);
        }
        logger.info("==============================");

        return foundGame;
    }

    @Override
    public List<GameEntity> findAll() {
        logger.info("=== FIND ALL GAMES ===");

        List<GameEntity> games = (List<GameEntity>) gameRepository.findAll();
        logger.info("Found {} games in database", games.size());
        logger.info("======================");

        return games;
    }
}