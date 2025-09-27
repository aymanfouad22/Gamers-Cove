package org.example.gamerscove.database;

import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.domain.entities.UserEntity;

public final class TestDataUtil {

    private TestDataUtil() {}

    public static UserEntity createTestUserEntityA() {
        return UserEntity.builder()
                .username("A")
                .password("password_A")
                .id(1L)
                .build();
    }

    public static UserEntity createTestUserEntityB() {
        return UserEntity.builder()
                .username("B")
                .password("password_B")
                .id(2L)
                .build();
    }

    public static UserEntity createTestUserEntityC() {
        return UserEntity.builder()
                .username("C")
                .password("password_C")
                .id(3L)
                .build();
    }

    public static GameEntity createTestGameEntityA() {
        return GameEntity.builder()
                .title("Game A")
                .description("cool game")
                .build();
    }

    public static GameEntity createTestGameEntityB() {
        return GameEntity.builder()
                .title("Game B")
                .description("cooler game than Game A")
                .build();
    }
}
