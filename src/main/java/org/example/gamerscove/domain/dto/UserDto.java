package org.example.gamerscove.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String firebaseUid;
    private String email;
    private String password;
    private String username;
    private String avatarUrl;
    private String bio;
    private String[] preferredPlatforms;
    private Long[] favoriteGameIds;
    private Map<String, String> gamertags;
    private String gamertagsVisibility;
}