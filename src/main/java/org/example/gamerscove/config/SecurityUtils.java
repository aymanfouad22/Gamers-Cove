package org.example.gamerscove.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility class for security-related operations
 */
@Component
public class SecurityUtils {

    /**
     * Get the Firebase UID of the currently authenticated user
     * @return Firebase UID or null if not authenticated
     */
    public static String getCurrentUserFirebaseUid() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return (String) authentication.getPrincipal();
        }
        return null;
    }

    /**
     * Get Firebase UID from request attributes
     * @param request HTTP request
     * @return Firebase UID or null
     */
    public static String getFirebaseUidFromRequest(HttpServletRequest request) {
        return (String) request.getAttribute("firebaseUid");
    }

    /**
     * Check if the current user owns the resource
     * @param resourceOwnerFirebaseUid Firebase UID of the resource owner
     * @return true if current user owns the resource
     */
    public static boolean isResourceOwner(String resourceOwnerFirebaseUid) {
        String currentUid = getCurrentUserFirebaseUid();
        return currentUid != null && currentUid.equals(resourceOwnerFirebaseUid);
    }

    /**
     * Check if user is authenticated
     * @return true if authenticated
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() 
               && !"anonymousUser".equals(authentication.getPrincipal());
    }
}
