package com.bookstore.backend.controller;

import com.bookstore.backend.model.User;
import com.bookstore.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 1. REGISTRATION (User Registration - 1.i)
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // 409 Conflict (Email Exists)
        }
    }

    // 6. LOGIN (User Login - 1.ii) // <-- NEW ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User userDetails) {
        String email = userDetails.getEmail();
        String password = userDetails.getPassword();

        return userService.authenticate(email, password)
                .map(user -> ResponseEntity.ok(user)) // 200 OK on success
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()); // 401 Unauthorized on failure
    }

    // 2. READ ALL (Admin Panel)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    // 3. READ ONE (Admin Panel / User Profile)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. UPDATE (User Profile Update - 1.iv)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.update(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE (Admin Panel)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}