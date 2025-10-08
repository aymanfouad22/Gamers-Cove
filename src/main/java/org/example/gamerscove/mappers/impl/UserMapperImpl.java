package org.example.gamerscove.mappers.impl;

import org.example.gamerscove.domain.dto.UserDto;
import org.example.gamerscove.domain.entities.UserEntity;
import org.example.gamerscove.mappers.Mapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements Mapper<UserEntity, UserDto> {

    @Override
    public UserDto mapTo(UserEntity userEntity) {
        return UserDto.builder()
                .id(userEntity.getId())
                .firebaseUid(userEntity.getFirebaseUid())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .username(userEntity.getUsername())
                .avatarUrl(userEntity.getAvatarUrl())
                .bio(userEntity.getBio())
                .preferredPlatforms(userEntity.getPreferredPlatforms())
                .favoriteGameIds(userEntity.getFavoriteGameIds())
                .gamertags(userEntity.getGamertags())
                .gamertagsVisibility(userEntity.getGamertagsVisibility() != null ?
                        userEntity.getGamertagsVisibility().getValue() : null)
                .build();
    }

    @Override
    public UserEntity mapFrom(UserDto userDto) {
        UserEntity userEntity = UserEntity.builder()
                .id(userDto.getId())
                .firebaseUid(userDto.getFirebaseUid())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .username(userDto.getUsername())
                .avatarUrl(userDto.getAvatarUrl())
                .bio(userDto.getBio())
                .gamertags(userDto.getGamertags())
                .build();

        userEntity.setPreferredPlatforms(userDto.getPreferredPlatforms());
        userEntity.setFavoriteGameIds(userDto.getFavoriteGameIds());

        if (userDto.getGamertagsVisibility() != null) {
            userEntity.setGamertagsVisibility(
                    UserEntity.GamertagsVisibility.valueOf(userDto.getGamertagsVisibility().toUpperCase())
            );
        }

        return userEntity;
    }
}