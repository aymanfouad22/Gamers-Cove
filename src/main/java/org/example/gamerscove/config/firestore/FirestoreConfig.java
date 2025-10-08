//package org.example.gamerscove.config.firestore;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.cloud.firestore.Firestore;
//import com.google.cloud.firestore.FirestoreOptions;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.io.FileInputStream;
//import java.io.IOException;
//
//@Configuration
//public class FirestoreConfig {
//
//    @Bean
//    public Firestore firestore() throws IOException {
//        FileInputStream serviceAccount =
//                new FileInputStream("src/main/resources/private-key.json"); // fetches service account key
//
//        FirestoreOptions firestoreOptions = FirestoreOptions.getDefaultInstance().toBuilder()
//                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                .setProjectId("gamers-cove-profile")
//                .build();
//
//        return firestoreOptions.getService();
//    }
//}
