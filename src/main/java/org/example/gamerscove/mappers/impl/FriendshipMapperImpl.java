package org.example.gamerscove.mappers.impl;

import org.example.gamerscove.domain.dto.FriendshipDto;
import org.example.gamerscove.domain.entities.FriendshipEntity;
import org.example.gamerscove.mappers.Mapper;
import org.springframework.stereotype.Component;

@Component
public class FriendshipMapperImpl implements Mapper<FriendshipEntity, FriendshipDto> {

    @Override
    public FriendshipDto mapTo(FriendshipEntity friendshipEntity) {
        return FriendshipDto.builder()
                .id(friendshipEntity.getId())
                .requesterId(friendshipEntity.getRequesterId())
                .receiverId(friendshipEntity.getReceiverId())
                .status(friendshipEntity.getStatus() != null ?
                        friendshipEntity.getStatus().getValue() : null)
                .createdAt(friendshipEntity.getCreatedAt())
                .build();
    }

    @Override
    public FriendshipEntity mapFrom(FriendshipDto friendshipDto) {
        return FriendshipEntity.builder()
                .id(friendshipDto.getId())
                .requesterId(friendshipDto.getRequesterId())
                .receiverId(friendshipDto.getReceiverId())
                .status(FriendshipEntity.FriendshipStatus.valueOf(friendshipDto.getStatus()))
                .createdAt(friendshipDto.getCreatedAt())
                .build();
    }
}