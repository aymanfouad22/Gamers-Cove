package org.example.gamerscove.controllers;

import org.example.gamerscove.domain.dto.GameDto;
import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.mappers.Mapper;
import org.example.gamerscove.services.GameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class GameController {

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    private final GameService gameService;
    private final Mapper<GameEntity, GameDto> gameMapper;
    private final RestTemplate restTemplate;

    // IGDB API Configuration
    @Value("${igdb.client.id:your-client-id}")
    private String igdbClientId;

    @Value("${igdb.access.token:your-access-token}")
    private String igdbAccessToken;

    private static final String IGDB_GAMES_ENDPOINT = "https://api.igdb.com/v4/games";

    public GameController(GameService gameService, Mapper<GameEntity, GameDto> gameMapper, RestTemplate restTemplate) {
        this.gameService = gameService;
        this.gameMapper = gameMapper;
        this.restTemplate = restTemplate;
    }

    // Simple DTOs for IGDB API Response (only what we need)
    public static class IGDBGameResponse {
        @JsonProperty("id")
        private Long id;

        @JsonProperty("name")
        private String name;

        @JsonProperty("summary")
        private String summary;

        @JsonProperty("cover")
        private IGDBCover cover;

        @JsonProperty("first_release_date")
        private Long firstReleaseDate;

        @JsonProperty("platforms")
        private List<IGDBPlatform> platforms;

        @JsonProperty("genres")
        private List<IGDBGenre> genres;

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public IGDBCover getCover() { return cover; }
        public void setCover(IGDBCover cover) { this.cover = cover; }

        public Long getFirstReleaseDate() { return firstReleaseDate; }
        public void setFirstReleaseDate(Long firstReleaseDate) { this.firstReleaseDate = firstReleaseDate; }

        public List<IGDBPlatform> getPlatforms() { return platforms; }
        public void setPlatforms(List<IGDBPlatform> platforms) { this.platforms = platforms; }

        public List<IGDBGenre> getGenres() { return genres; }
        public void setGenres(List<IGDBGenre> genres) { this.genres = genres; }
    }

    public static class IGDBCover {
        @JsonProperty("image_id")
        private String imageId;

        public String getImageId() { return imageId; }
        public void setImageId(String imageId) { this.imageId = imageId; }
    }

    public static class IGDBPlatform {
        @JsonProperty("name")
        private String name;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class IGDBGenre {
        @JsonProperty("name")
        private String name;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // Basic CRUD endpoints for your local games

    @GetMapping(path = "/games/{gameId}")
    public ResponseEntity<GameDto> getGameById(@PathVariable("gameId") Long gameId) {
        logger.info("=== GET /api/games/{} ===", gameId);

        Optional<GameEntity> game = gameService.findById(gameId);

        if (game.isPresent()) {
            GameDto gameDto = gameMapper.mapTo(game.get());
            logger.info("Found game: {}", gameDto.getTitle());
            return ResponseEntity.ok(gameDto);
        } else {
            logger.warn("Game not found with ID: {}", gameId);
            return ResponseEntity.notFound().build();
        }
    }

    // Main endpoint: Import first 5 games from IGDB and store them
    @PostMapping(path = "/games/import-from-igdb")
    public ResponseEntity<String> importGamesFromIGDB() {
        logger.info("=== POST /api/games/import-from-igdb ===");
        logger.info("Importing first 5 games from IGDB API...");

        try {
            List<IGDBGameResponse> igdbGames = fetchFirst5GamesFromIGDB();

            int savedCount = 0;
            for (IGDBGameResponse igdbGame : igdbGames) {
                try {
                    // Check if game already exists to avoid duplicates
                    String externalApiId = "igdb_" + igdbGame.getId();
                    if (!gameAlreadyExists(externalApiId)) {
                        GameEntity gameEntity = convertIGDBToGameEntity(igdbGame);
                        gameService.createGameEntity(gameEntity);
                        savedCount++;
                        logger.info("Successfully imported game: {}", gameEntity.getTitle());
                    } else {
                        logger.info("Game already exists, skipping: {}", igdbGame.getName());
                    }
                } catch (Exception e) {
                    logger.warn("Failed to import game {}: {}", igdbGame.getName(), e.getMessage());
                }
            }

            String message = String.format("Successfully imported %d new games from IGDB", savedCount);
            logger.info(message);
            return ResponseEntity.ok(message);

        } catch (Exception e) {
            logger.error("Error importing games from IGDB: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Failed to import games from IGDB: " + e.getMessage());
        }
    }

    // Private helper methods

    private List<IGDBGameResponse> fetchFirst5GamesFromIGDB() {
        logger.info("Fetching first 5 games from IGDB API...");

        HttpHeaders headers = createIGDBHeaders();
        // Query for first 5 popular games with all needed fields
        String requestBody = "fields name,summary,cover.image_id,first_release_date,platforms.name,genres.name; " +
                "where rating > 70; " +
                "sort rating desc; " +
                "limit 5;";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<IGDBGameResponse[]> response = restTemplate.exchange(
                    IGDB_GAMES_ENDPOINT,
                    HttpMethod.POST,
                    entity,
                    IGDBGameResponse[].class
            );

            IGDBGameResponse[] games = response.getBody();
            logger.info("Successfully fetched {} games from IGDB", games != null ? games.length : 0);
            return games != null ? Arrays.asList(games) : List.of();

        } catch (Exception e) {
            logger.error("Failed to fetch games from IGDB: {}", e.getMessage());
            throw new RuntimeException("IGDB API request failed", e);
        }
    }

    private HttpHeaders createIGDBHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", igdbClientId);
        headers.set("Authorization", "Bearer " + igdbAccessToken);
        headers.set("Accept", "application/json");
        return headers;
    }

    private GameEntity convertIGDBToGameEntity(IGDBGameResponse igdbGame) {
        GameEntity gameEntity = new GameEntity();

        // Set required fields
        gameEntity.setExternalApiId("igdb_" + igdbGame.getId());
        gameEntity.setTitle(igdbGame.getName());
        gameEntity.setDescription(igdbGame.getSummary() != null ? igdbGame.getSummary() : "No description available");

        // Set cover image URL using IGDB's image service
        if (igdbGame.getCover() != null && igdbGame.getCover().getImageId() != null) {
            String coverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/" +
                    igdbGame.getCover().getImageId() + ".jpg";
            gameEntity.setCoverImageUrl(coverUrl);
        } else {
            gameEntity.setCoverImageUrl(""); // Default empty if no cover
        }

        // Convert Unix timestamp to LocalDate
        if (igdbGame.getFirstReleaseDate() != null) {
            LocalDate releaseDate = Instant.ofEpochSecond(igdbGame.getFirstReleaseDate())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            gameEntity.setReleaseDate(releaseDate);
        }

        // Convert platforms list to String array
        if (igdbGame.getPlatforms() != null && !igdbGame.getPlatforms().isEmpty()) {
            String[] platforms = igdbGame.getPlatforms().stream()
                    .map(IGDBPlatform::getName)
                    .toArray(String[]::new);
            gameEntity.setPlatforms(platforms);
        }

        // Convert genres list to String array
        if (igdbGame.getGenres() != null && !igdbGame.getGenres().isEmpty()) {
            String[] genres = igdbGame.getGenres().stream()
                    .map(IGDBGenre::getName)
                    .toArray(String[]::new);
            gameEntity.setGenres(genres);
        }

        return gameEntity;
    }

    private boolean gameAlreadyExists(String externalApiId) {
        // This is a simple check - you might want to implement this in your GameService
        // For now, we'll assume it doesn't exist (you can enhance this later)
        return false;
    }
}