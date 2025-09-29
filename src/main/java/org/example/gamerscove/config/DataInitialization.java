package org.example.gamerscove.config;

import org.example.gamerscove.domain.entities.GameEntity;
import org.example.gamerscove.domain.entities.ReviewEntity;
import org.example.gamerscove.domain.entities.UserEntity;
import org.example.gamerscove.repositories.GameRepository;
import org.example.gamerscove.repositories.ReviewRepository;
import org.example.gamerscove.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@Profile({"dev", "test"})
public class DataInitialization implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitialization.class);
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final ReviewRepository reviewRepository;

    public DataInitialization(UserRepository userRepository, GameRepository gameRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("=== INITIALIZING SAMPLE DATA (Profile: dev/test) ===");

        if (gameRepository.count() == 0) {
            createSampleGames();
            logger.info("Game sample data created successfully!");
        } else {
            logger.info("Database already has game sample, skipping initialization");
        }

        if (userRepository.count() == 0) {
            createSampleUsers();
            logger.info("User sample data created successfully!");
        } else {
            logger.info("Database already has user sample, skipping initialization");
        }

        if (reviewRepository.count() == 0) {
            createSampleReviews();
            logger.info("Review sample data created successfully!");
        } else {
            logger.info("Database already has review sample, skipping initialization");
        }

        logger.info("================================================");
    }

    private void createSampleUsers() {

        UserEntity user1 = UserEntity.builder()
                .firebaseUid("sample-firebase-uid-001")
                .username("zelda_fan")
                .email("zelda.fan@example.com")
                .password("password123")
                .bio("Nintendo enthusiast and Zelda speedrunner")
                .avatarUrl("https://example.com/zelda-avatar.jpg")
                .gamertagsVisibility(UserEntity.GamertagsVisibility.PUBLIC)
                .build();

        user1.setPreferredPlatforms(new String[]{"Nintendo Switch", "PC"});
        user1.setFavoriteGameIds(new Long[]{1L, 2L});

        Map<String, String> user1Gamertags = new HashMap<>();
        user1Gamertags.put("Nintendo", "zelda_speedrun");
        user1Gamertags.put("Steam", "zelda_fan_pc");
        user1.setGamertags(user1Gamertags);

        userRepository.save(user1);
        logger.info("Created user: " + user1.getUsername());

        UserEntity user2 = UserEntity.builder()
                .firebaseUid("sample-firebase-uid-002")
                .username("fps_master")
                .email("fps.master@example.com")
                .password("securepass456")
                .bio("Competitive FPS player, always looking for new challenges")
                .avatarUrl("https://example.com/fps-avatar.jpg")
                .gamertagsVisibility(UserEntity.GamertagsVisibility.FRIENDS)
                .build();

        user2.setPreferredPlatforms(new String[]{"PC", "PlayStation"});
        user2.setFavoriteGameIds(new Long[]{1L, 2L});

        Map<String, String> user2Gamertags = new HashMap<>();
        user2Gamertags.put("Steam", "fps_master_2024");
        user2Gamertags.put("PSN", "fps_master_ps");
        user2.setGamertags(user2Gamertags);

        userRepository.save(user2);
        logger.info("Created user: " + user2.getUsername());

        UserEntity user3 = UserEntity.builder()
                .firebaseUid("sample-firebase-uid-003")
                .username("rpg_lover")
                .email("rpg.lover@example.com")
                .password("fantasy789")
                .bio("JRPG enthusiast, love long story-driven games")
                .avatarUrl("https://example.com/rpg-avatar.jpg")
                .gamertagsVisibility(UserEntity.GamertagsVisibility.PUBLIC)
                .build();

        user3.setPreferredPlatforms(new String[]{"PlayStation", "Nintendo Switch", "PC"});
        user3.setFavoriteGameIds(new Long[]{1L, 2L});

        Map<String, String> user3Gamertags = new HashMap<>();
        user3Gamertags.put("PSN", "rpg_lover_final");
        user3Gamertags.put("Steam", "rpg_collector");
        user3Gamertags.put("Nintendo", "rpg_lover_switch");
        user3.setGamertags(user3Gamertags);

        userRepository.save(user3);
        logger.info("Created user: " + user3.getUsername());
    }

    private void createSampleGames() {
        LocalDate releaseDate = LocalDate.now();

        GameEntity game1 = GameEntity.builder()
                .title("Dying Light: The Beast")
                .coverImageUrl(".com")
                .externalApiId("something")
                .description("better than dying light 2")
                .build();

        game1.setGenres(new String[]{"zombie", "first-person", "parkour"});
        game1.setReleaseDate(releaseDate);
        game1.setPlatforms(new String[]{"Nintendo Switch", "PC"});

        gameRepository.save(game1);
        logger.info("Created game: " + game1.getTitle());

        GameEntity game2 = GameEntity.builder()
                .title("Minecraft")
                .coverImageUrl("microsoft.jpeg.com")
                .externalApiId("api id for best game ever")
                .description("also better than dyling light 2")
                .build();

        game2.setGenres(new String[]{"sandbox", "survival", "fun"});
        game2.setReleaseDate(releaseDate);
        game2.setPlatforms(new String[]{"Nintendo Switch", "PC"});

        gameRepository.save(game2);
        logger.info("Created game: " + game2.getTitle());
    }

    private void createSampleReviews() {
        // Fetch existing users and games
        Optional<UserEntity> user1 = userRepository.findByUsername("zelda_fan");
        Optional<UserEntity> user2 = userRepository.findByUsername("fps_master");
        Optional<GameEntity> game1 = gameRepository.findByTitle("Dying Light: The Beast");
        Optional<GameEntity> game2 = gameRepository.findByTitle("Minecraft");

        if (user1.isEmpty() || user2.isEmpty() || game1.isEmpty() || game2.isEmpty()) {
            logger.warn("Cannot create sample reviews - users or games not found");
            return;
        }

        // Review 1: zelda_fan reviews Dying Light: The Beast
        ReviewEntity review1 = new ReviewEntity();
        review1.setUser(user1.get());
        review1.setGame(game1.get());
        review1.setRating(8);
        review1.setContent("Absolutely thrilling experience! The parkour mechanics are incredibly smooth and the zombie encounters keep you on your toes. " +
                "The atmosphere is intense and the open-world design gives you plenty of freedom to explore. " +
                "My only complaint is that some missions feel a bit repetitive, but overall it's a fantastic game that I highly recommend!");

        reviewRepository.save(review1);
        logger.info("Created review: " + user1.get().getUsername() + " reviewed " + game1.get().getTitle() + " with rating " + review1.getRating() + "/10");

        // Review 2: fps_master reviews Minecraft
        ReviewEntity review2 = new ReviewEntity();
        review2.setUser(user2.get());
        review2.setGame(game2.get());
        review2.setRating(10);
        review2.setContent("Minecraft is a timeless masterpiece! The creative freedom is unmatched - you can literally build anything you can imagine. " +
                "The survival mode provides a perfect balance of challenge and exploration. " +
                "Whether you're playing solo or with friends, there's always something new to discover. " +
                "The regular updates keep the game fresh and exciting. A must-play for gamers of all ages!");

        reviewRepository.save(review2);
        logger.info("Created review: " + user2.get().getUsername() + " reviewed " + game2.get().getTitle() + " with rating " + review2.getRating() + "/10");
    }
}