package org.example.gamerscove.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.stream.Collectors;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Table(name = "users") // Note: 'user' is a reserved keyword in PostgreSQL
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 128)
    @Column(name = "firebase_uid", nullable = false, unique = true, length = 128)
    private String firebaseUid;

    @Transient
    private String email;

    @Transient
    private String password;

    @NotNull
    @Size(max = 50)
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "preferred_platforms", columnDefinition = "TEXT")
    private String preferredPlatforms;

    // CHANGED: Store game IDs as comma-separated string
    @Column(name = "favorite_game_ids", columnDefinition = "TEXT")
    private String favoriteGameIds;

    // CHANGED: ElementCollection for proper Map storage
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "user_gamertags",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @MapKeyColumn(name = "platform")
    @Column(name = "gamertag")
    @Builder.Default
    private Map<String, String> gamertags = new HashMap<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "gamertags_visibility", length = 10, columnDefinition = "varchar(10) default 'FRIENDS'")
    private GamertagsVisibility gamertagsVisibility = GamertagsVisibility.FRIENDS;

    // Enum for gamertags_visibility
    public enum GamertagsVisibility {
        PUBLIC("PUBLIC"),
        FRIENDS("FRIENDS");

        private final String value;

        GamertagsVisibility(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    // Utility methods for preferred platforms array
    public String[] getPreferredPlatforms() {
        if (preferredPlatforms == null || preferredPlatforms.trim().isEmpty()) {
            return new String[0];
        }
        return preferredPlatforms.split(",");
    }

    public void setPreferredPlatforms(String[] platforms) {
        if (platforms == null || platforms.length == 0) {
            this.preferredPlatforms = null;
        } else {
            this.preferredPlatforms = String.join(",", platforms);
        }
    }

    // NEW: Utility methods for favorite game IDs
    public Long[] getFavoriteGameIds() {
        if (favoriteGameIds == null || favoriteGameIds.trim().isEmpty()) {
            return new Long[0];
        }
        return Arrays.stream(favoriteGameIds.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .toArray(Long[]::new);
    }

    public void setFavoriteGameIds(Long[] gameIds) {
        if (gameIds == null || gameIds.length == 0) {
            this.favoriteGameIds = null;
        } else {
            this.favoriteGameIds = Arrays.stream(gameIds)
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
        }
    }

    // Helper methods for managing favorite games
    public void addFavoriteGameId(Long gameId) {
        Long[] currentIds = getFavoriteGameIds();

        // Check if game ID already exists
        for (Long id : currentIds) {
            if (id.equals(gameId)) {
                return; // Already exists
            }
        }

        // Add new game ID
        Long[] newIds = new Long[currentIds.length + 1];
        System.arraycopy(currentIds, 0, newIds, 0, currentIds.length);
        newIds[currentIds.length] = gameId;
        setFavoriteGameIds(newIds);
    }

    public void removeFavoriteGameId(Long gameId) {
        Long[] currentIds = getFavoriteGameIds();
        Long[] newIds = Arrays.stream(currentIds)
                .filter(id -> !id.equals(gameId))
                .toArray(Long[]::new);
        setFavoriteGameIds(newIds);
    }

    public boolean hasFavoriteGameId(Long gameId) {
        Long[] currentIds = getFavoriteGameIds();
        return Arrays.stream(currentIds).anyMatch(id -> id.equals(gameId));
    }

    // Backward compatibility - convert String[] to Long[]
    public void setFavoriteGames(String[] gameNames) {
        // This method is kept for backward compatibility but should be deprecated
        // You should use setFavoriteGameIds instead
    }

    public String[] getFavoriteGames() {
        // This method is kept for backward compatibility
        // In practice, you'd need to fetch game titles by IDs from GameService
        return new String[0];
    }

    // UPDATED: Gamertags methods now work with proper Map
    public void addGamertag(String platform, String gamertag) {
        if (gamertags == null) {
            gamertags = new HashMap<>();
        }
        gamertags.put(platform, gamertag);
    }

    public void removeGamertag(String platform) {
        if (gamertags != null) {
            gamertags.remove(platform);
        }
    }

    public String getGamertag(String platform) {
        return gamertags != null ? gamertags.get(platform) : null;
    }

    public UserEntity(String firebaseUid, String username, String email, String password) {
        this.firebaseUid = firebaseUid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.gamertags = new HashMap<>();
    }
}