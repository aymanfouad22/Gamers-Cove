package org.example.gamerscove.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseTokenFilter.class);
    private final FirebaseAuth firebaseAuth;

    public FirebaseTokenFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        logger.debug("Processing request: {} {}", method, requestURI);

        // Check if this is a public endpoint
        boolean isPublicEndpoint = isPublicEndpoint(requestURI, method);
        
        // Extract token from Authorization header
        String authorizationHeader = request.getHeader("Authorization");
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            
            try {
                // Verify the Firebase token
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
                String uid = decodedToken.getUid();
                String email = decodedToken.getEmail();
                
                logger.info("✅ Authenticated user: {} ({})", email, uid);
                
                // Set authentication in Spring Security context
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(uid, null, new ArrayList<>());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Add Firebase UID to request attributes for easy access in controllers
                request.setAttribute("firebaseUid", uid);
                request.setAttribute("email", email);
                
            } catch (FirebaseAuthException e) {
                logger.error("❌ Invalid Firebase token: {}", e.getMessage());
                
                // If it's a protected endpoint, reject the request
                if (!isPublicEndpoint) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Invalid or expired authentication token\"}");
                    return;
                }
            }
        } else {
            // No token provided
            if (isPublicEndpoint) {
                logger.debug("ℹ️ Public endpoint accessed without token: {} {}", method, requestURI);
            } else {
                logger.debug("⚠️ Protected endpoint accessed without token: {} {}", method, requestURI);
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Check if the endpoint is public (doesn't require authentication)
     */
    private boolean isPublicEndpoint(String uri, String method) {
        // Public GET endpoints
        if ("GET".equals(method)) {
            if (uri.matches("/api/games(/.*)?") || 
                uri.matches("/api/games/.+/reviews") ||
                uri.matches("/api/reviews/\\d+") ||
                uri.matches("/api/users/username/.+")) {
                return true;
            }
        }
        
        // Public POST endpoints
        if ("POST".equals(method)) {
            if (uri.equals("/api/users")) {
                return true; // User registration
            }
        }
        
        return false;
    }
}
