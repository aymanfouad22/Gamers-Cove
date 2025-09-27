package org.example.gamerscove.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "games")
@Getter @Setter
public class GameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "external_api_id", nullable = false, unique = true, length = 100)
    private String externalApiId;

    @NotNull
    @Size(max = 200)
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "platforms", columnDefinition = "TEXT")
    private String platforms;

    @Column(name = "genres", columnDefinition = "TEXT")
    private String genres;

    public String[] getPlatforms() {
        if (platforms == null || platforms.trim().isEmpty()) {
            return new String[0];
        }
        return platforms.split(",");
    }

    public void setPlatforms(String[] platforms) {
        if (platforms == null || platforms.length == 0) {
            this.platforms = null;
        } else {
            this.platforms = String.join(",", platforms);
        }
    }

    // Utility methods for genres array
    public String[] getGenres() {
        if (genres == null || genres.trim().isEmpty()) {
            return new String[0];
        }
        return genres.split(",");
    }

    public void setGenres(String[] genres) {
        if (genres == null || genres.length == 0) {
            this.genres = null;
        } else {
            this.genres = String.join(",", genres);
        }
    }

    // Constructor with required fields
    public GameEntity(String externalApiId, String title) {
        this.externalApiId = externalApiId;
        this.title = title;
    }

    // Full constructor
    public GameEntity(String externalApiId, String title, String description,
                      String coverImageUrl, LocalDate releaseDate,
                      String[] platforms, String[] genres) {
        this.externalApiId = externalApiId;
        this.title = title;
        this.description = description;
        this.coverImageUrl = coverImageUrl;
        this.releaseDate = releaseDate;
        setPlatforms(platforms); // Use setter to handle conversion
        setGenres(genres); // Use setter to handle conversion
    }

    // Convenience methods for array operations
    public boolean hasPlatform(String platform) {
        String[] platforms = getPlatforms();
        if (platforms.length == 0) return false;
        for (String p : platforms) {
            if (platform.equalsIgnoreCase(p.trim())) {
                return true;
            }
        }
        return false;
    }

    public boolean hasGenre(String genre) {
        String[] genres = getGenres();
        if (genres.length == 0) return false;
        for (String g : genres) {
            if (genre.equalsIgnoreCase(g.trim())) {
                return true;
            }
        }
        return false;
    }

    public void addPlatform(String platform) {
        String[] currentPlatforms = getPlatforms();
        if (currentPlatforms.length == 0) {
            setPlatforms(new String[]{platform});
        } else {
            if (hasPlatform(platform)) {
                return;
            }
            String[] newPlatforms = new String[currentPlatforms.length + 1];
            System.arraycopy(currentPlatforms, 0, newPlatforms, 0, currentPlatforms.length);
            newPlatforms[currentPlatforms.length] = platform;
            setPlatforms(newPlatforms);
        }
    }

    public void addGenre(String genre) {
        String[] currentGenres = getGenres();
        if (currentGenres.length == 0) {
            setGenres(new String[]{genre});
        } else {
            if (hasGenre(genre)) {
                return;
            }
            String[] newGenres = new String[currentGenres.length + 1];
            System.arraycopy(currentGenres, 0, newGenres, 0, currentGenres.length);
            newGenres[currentGenres.length] = genre;
            setGenres(newGenres);
        }
    }

    public void removePlatform(String platform) {
        String[] currentPlatforms = getPlatforms();
        if (currentPlatforms.length == 0) return;

        List<String> platformList = new ArrayList<>();
        for (String p : currentPlatforms) {
            if (!platform.equalsIgnoreCase(p.trim())) {
                platformList.add(p.trim());
            }
        }
        setPlatforms(platformList.toArray(new String[0]));
    }

    public void removeGenre(String genre) {
        String[] currentGenres = getGenres();
        if (currentGenres.length == 0) return;

        List<String> genreList = new ArrayList<>();
        for (String g : currentGenres) {
            if (!genre.equalsIgnoreCase(g.trim())) {
                genreList.add(g.trim());
            }
        }
        setGenres(genreList.toArray(new String[0]));
    }

    public String getPlatformsAsString() {
        String[] platforms = getPlatforms();
        if (platforms.length == 0) {
            return "";
        }
        return String.join(", ", platforms);
    }

    public String getGenresAsString() {
        String[] genres = getGenres();
        if (genres.length == 0) {
            return "";
        }
        return String.join(", ", genres);
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", externalApiId='" + externalApiId + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", coverImageUrl='" + coverImageUrl + '\'' +
                ", releaseDate=" + releaseDate +
                ", platforms=" + getPlatformsAsString() +
                ", genres=" + getGenresAsString() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GameEntity gameEntity = (GameEntity) o;
        return externalApiId != null ? externalApiId.equals(gameEntity.externalApiId) : gameEntity.externalApiId == null;
    }

    @Override
    public int hashCode() {
        return externalApiId != null ? externalApiId.hashCode() : 0;
    }
}