package com.bookstore.backend.service;

import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder; // Added for Hashing

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Added for Hashing

    // 1. REGISTRATION (User Registration - 1.i)
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use.");
        }

        // HASH THE PASSWORD BEFORE SAVING
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    // 7. LOGIN (User Login - 1.ii) // <-- NEW METHOD
    public Optional<User> authenticate(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Compare the plain-text password with the stored hashed password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
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

    // 6. DELETE
    public void delete(String id) {
        userRepository.deleteById(id);
    }
}