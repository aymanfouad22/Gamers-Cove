package org.example.gamerscove.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.example.gamerscove.controllers.GameController;

import java.util.List;

public class IGDBGameResponseDto {

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