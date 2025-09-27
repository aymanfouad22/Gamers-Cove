package org.example.gamerscove.mappers.impl;

import org.example.gamerscove.domain.dto.GameDto;
import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.mappers.Mapper;
import org.springframework.stereotype.Component;

@Component
public class GameMapperImpl implements Mapper<GameEntity, GameDto> {

    @Override
    public GameDto mapTo(GameEntity gameEntity) {
        return GameDto.builder()
                .id(gameEntity.getId())
                .externalApiId(gameEntity.getExternalApiId())
                .title(gameEntity.getTitle())
                .description(gameEntity.getDescription())
                .coverImageUrl(gameEntity.getCoverImageUrl())
                .releaseDate(gameEntity.getReleaseDate())
                .platforms(gameEntity.getPlatforms())
                .genres(gameEntity.getGenres())
                .build();
    }

    @Override
    public GameEntity mapFrom(GameDto gameDto) {
        GameEntity gameEntity = GameEntity.builder()
                .id(gameDto.getId())
                .externalApiId(gameDto.getExternalApiId())
                .title(gameDto.getTitle())
                .description(gameDto.getDescription())
                .coverImageUrl(gameDto.getCoverImageUrl())
                .releaseDate(gameDto.getReleaseDate())
                .build();

        gameEntity.setPlatforms(gameDto.getPlatforms());
        gameEntity.setGenres(gameDto.getGenres());

        return gameEntity;
    }
}