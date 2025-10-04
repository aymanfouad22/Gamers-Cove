package org.example.gamerscove.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        logger.info("Initializing Firebase Admin SDK...");

        try {
            // Using service account key file
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/gamers-cove-profile-firebase-adminsdk-fbsvc-b91ecff065.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
           

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK initialized successfully");
            }

            return FirebaseAuth.getInstance();
        } catch (Exception e) {
            logger.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
            throw e;
        }
    }
}
