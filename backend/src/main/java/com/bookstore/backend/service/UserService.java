package com.bookstore.backend.service;

import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder; // Added for Hashing
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Added for Hashing

    // 1. REGISTRATION (User Registration - 1.i)
    public User registerUser(User user) {
        logger.info("Attempting to register user with email: {}", user.getEmail());
        
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("Registration failed: Email already in use: {}", user.getEmail());
            throw new IllegalArgumentException("Email already in use.");
        }

        // HASH THE PASSWORD BEFORE SAVING
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        try {
            logger.info("Saving user to MongoDB: email={}, name={}", user.getEmail(), user.getName());
            logger.debug("User object before save: user_id={}, role={}, createdAt={}", 
                user.getUser_id(), user.getRole(), user.getCreatedAt());
            
            User savedUser = userRepository.save(user);
            
            logger.info("User saved to repository. Checking if ID was generated...");
            logger.info("Saved user ID: {}", savedUser.getUser_id());
            
            if (savedUser.getUser_id() == null || savedUser.getUser_id().isEmpty()) {
                logger.error("CRITICAL: User saved but ID is null! MongoDB may not be persisting data.");
                throw new RuntimeException("User ID was not generated. MongoDB save may have failed.");
            }
            
            // Verify the user can be retrieved
            Optional<User> verifyUser = userRepository.findById(savedUser.getUser_id());
            if (verifyUser.isEmpty()) {
                logger.error("CRITICAL: User saved but cannot be retrieved! Data may not be persisted.");
                throw new RuntimeException("User was saved but cannot be retrieved from database.");
            }
            
            logger.info("User registered successfully: {} with ID: {}", savedUser.getEmail(), savedUser.getUser_id());
            return savedUser;
        } catch (Exception e) {
            logger.error("Failed to save user to database: {}", e.getMessage(), e);
            logger.error("Exception type: {}", e.getClass().getName());
            if (e.getCause() != null) {
                logger.error("Caused by: {}", e.getCause().getMessage());
            }
            throw new RuntimeException("Failed to register user: " + e.getMessage(), e);
        }
    }

    // 7. LOGIN (User Login - 1.ii) // <-- NEW METHOD
    public Optional<User> authenticate(String email, String password) {
        logger.debug("Attempting to authenticate user with email: {}", email);
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            logger.debug("User found: {} with role: {}", user.getEmail(), user.getRole());

            // Compare the plain-text password with the stored hashed password
            if (passwordEncoder.matches(password, user.getPassword())) {
                logger.info("Authentication successful for user: {}", email);
                return Optional.of(user);
            } else {
                logger.warn("Authentication failed: Invalid password for user: {}", email);
            }
        } else {
            logger.warn("Authentication failed: User not found with email: {}", email);
        }

        return Optional.empty();
    }

    // 2. READ ALL
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // 3. READ ONE
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    // 4. FIND BY EMAIL
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 5. UPDATE
    public User update(String id, User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();

            existingUser.setName(userDetails.getName());
            existingUser.setAddress(userDetails.getAddress());
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());

            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    // 7. UPDATE ROLE (Admin only - for changing user roles)
    public User updateRole(String id, String role) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setRole(role);
            return userRepository.save(existingUser);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    // 6. DELETE
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    // 8. CHANGE PASSWORD
    public void changePassword(String userId, String currentPassword, String newPassword) {
        logger.info("Attempting to change password for user ID: {}", userId);
        
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            logger.warn("Password change failed: User not found with ID: {}", userId);
            throw new RuntimeException("User not found");
        }
        
        User user = userOptional.get();
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            logger.warn("Password change failed: Current password is incorrect for user: {}", user.getEmail());
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Validate new password
        if (newPassword == null || newPassword.isEmpty() || newPassword.length() < 6) {
            logger.warn("Password change failed: New password is too short");
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }
        
        // Hash and save new password
        String hashedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedNewPassword);
        userRepository.save(user);
        
        logger.info("Password changed successfully for user: {}", user.getEmail());
    }
}