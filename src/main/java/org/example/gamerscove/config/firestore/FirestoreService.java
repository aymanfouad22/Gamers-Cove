//package org.example.gamerscove.config.firestore;
//
//import org.example.gamerscove.domain.entities.UserEntity;
//import com.google.api.core.ApiFuture;
//import com.google.cloud.firestore.*;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.concurrent.ExecutionException;
//
//public class FirestoreService {
//
//    private static final String COLLECTION_NAME = "users";
//
//    private final Firestore firestore;
//    private final PasswordEncoder passwordEncoder;
//
//    public FirestoreService(Firestore firestore) {
//        this.firestore = firestore;
//        this.passwordEncoder = new BCryptPasswordEncoder();
//    }
//
//    /**
//     * Creates a new user document in Firestore with firestoreId, email, and hashed password.
//     * The document ID will be the firestoreId.
//     *
//     * @param userEntity The User object containing firestoreId, email, and password.
//     * @return The update time of the document.
//     * @throws ExecutionException
//     * @throws InterruptedException
//     */
//    public String createUser(UserEntity userEntity) throws ExecutionException, InterruptedException {
//        // Validate required fields for Firestore
//        if (userEntity.getFirebaseUid() == null || userEntity.getFirebaseUid().trim().isEmpty()) {
//            throw new IllegalArgumentException("FirestoreId cannot be null or empty");
//        }
//        if (userEntity.getEmail() == null || userEntity.getEmail().trim().isEmpty()) {
//            throw new IllegalArgumentException("Email cannot be null or empty");
//        }
//        if (userEntity.getPassword() == null || userEntity.getPassword().trim().isEmpty()) {
//            throw new IllegalArgumentException("Password cannot be null or empty");
//        }
//
//        // Create a map with only the fields we want to store in Firestore
//        Map<String, Object> firestoreUser = new HashMap<>();
//        firestoreUser.put("firestoreId", userEntity.getFirebaseUid());
//        firestoreUser.put("email", userEntity.getEmail());
//        firestoreUser.put("password", passwordEncoder.encode(userEntity.getPassword())); // Hash the password
//
//        // Optional: Include other fields if they exist
//        if (userEntity.getFirebaseUid() != null) {
//            firestoreUser.put("firebaseUid", userEntity.getFirebaseUid());
//        }
//        if (userEntity.getUsername() != null) {
//            firestoreUser.put("username", userEntity.getUsername());
//        }
//
//        ApiFuture<WriteResult> writeResult = firestore.collection(COLLECTION_NAME)
//                .document(userEntity.getFirebaseUid())
//                .set(firestoreUser);
//        return writeResult.get().getUpdateTime().toString();
//    }
//
//    /**
//     * Retrieves a user by their firestoreId.
//     *
//     * @param firestoreId The unique Firestore ID of the user.
//     * @return The User object if found, otherwise null.
//     * @throws ExecutionException
//     * @throws InterruptedException
//     */
//    public UserEntity getUserByFirestoreId(String firestoreId) throws ExecutionException, InterruptedException {
//        DocumentReference documentReference = firestore.collection(COLLECTION_NAME).document(firestoreId);
//        ApiFuture<DocumentSnapshot> future = documentReference.get();
//        DocumentSnapshot document = future.get();
//
//        if (document.exists()) {
//            Map<String, Object> data = document.getData();
//            if (data != null) {
//                UserEntity userEntity = new UserEntity();
//                userEntity.setFirebaseUid(document.getId());
//                userEntity.setEmail((String) data.get("email"));
//                userEntity.setPassword((String) data.get("password")); // This will be the hashed password
//                userEntity.setFirebaseUid((String) data.get("firebaseUid"));
//                userEntity.setUsername((String) data.get("username"));
//                return userEntity;
//            }
//        }
//        return null;
//    }
//
//    /**
//     * Finds a user by their email address.
//     *
//     * @param email The email address to search for.
//     * @return The User object if found, otherwise null.
//     * @throws ExecutionException
//     * @throws InterruptedException
//     */
//    public UserEntity getUserByEmail(String email) throws ExecutionException, InterruptedException {
//        Query query = firestore.collection(COLLECTION_NAME).whereEqualTo("email", email);
//        ApiFuture<QuerySnapshot> querySnapshot = query.get();
//
//        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
//            if (document.exists()) {
//                Map<String, Object> data = document.getData();
//                if (data != null) {
//                    UserEntity userEntity = new UserEntity();
//                    userEntity.setFirebaseUid(document.getId());
//                    userEntity.setEmail((String) data.get("email"));
//                    userEntity.setPassword((String) data.get("password"));
//                    userEntity.setFirebaseUid((String) data.get("firebaseUid"));
//                    userEntity.setUsername((String) data.get("username"));
//                    return userEntity;
//                }
//            }
//        }
//        return null;
//    }
//
//    /**
//     * Validates a user's password against the stored hashed password.
//     *
//     * @param rawPassword The plain text password to validate.
//     * @param hashedPassword The hashed password from Firestore.
//     * @return true if passwords match, false otherwise.
//     */
//    public boolean validatePassword(String rawPassword, String hashedPassword) {
//        return passwordEncoder.matches(rawPassword, hashedPassword);
//    }
//
//    /**
//     * Updates a user's password in Firestore.
//     *
//     * @param firestoreId The user's Firestore ID.
//     * @param newPassword The new password (will be hashed before storing).
//     * @return The update time of the document.
//     * @throws ExecutionException
//     * @throws InterruptedException
//     */
//    public String updateUserPassword(String firestoreId, String newPassword) throws ExecutionException, InterruptedException {
//        Map<String, Object> updates = new HashMap<>();
//        updates.put("password", passwordEncoder.encode(newPassword));
//
//        ApiFuture<WriteResult> writeResult = firestore.collection(COLLECTION_NAME)
//                .document(firestoreId)
//                .update(updates);
//        return writeResult.get().getUpdateTime().toString();
//    }
//
//
//    /**
//     * Deletes a user document from Firestore.
//     *
//     * @param firestoreId The Firestore ID of the user to delete.
//     * @return The update time of the deletion.
//     * @throws ExecutionException
//     * @throws InterruptedException
//     */
//    public String deleteUser(String firestoreId) throws ExecutionException, InterruptedException {
//        ApiFuture<WriteResult> writeResult = firestore.collection(COLLECTION_NAME)
//                .document(firestoreId)
//                .delete();
//        return writeResult.get().getUpdateTime().toString();
//    }
//
//    /**
//     * Authenticates a user by email and password.
//     *
//     * @param email The user's email.
//     * @param password The user's plain text password.
//     * @return The User object if authentication succeeds, null otherwise.
//     * @throws ExecutionException
//     * @throws InterruptedException
//     */
//    public UserEntity authenticateUser(String email, String password) throws ExecutionException, InterruptedException {
//        UserEntity userEntity = getUserByEmail(email);
//        if (userEntity != null && validatePassword(password, userEntity.getPassword())) {
//            // Don't return the hashed password in the authenticated user object
//            userEntity.setPassword(null);
//            return userEntity;
//        }
//        return null;
//    }
//}