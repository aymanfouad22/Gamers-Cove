package org.example.gamerscove.domain.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameDto {

    private Long id;
    private String externalApiId;
    private String title;
    private String description;
    private String coverImageUrl;
    private LocalDate releaseDate;
    private String[] platforms;
    private String[] genres;
}
