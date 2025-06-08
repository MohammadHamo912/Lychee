package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.User;
import com.mohammad.lychee.lychee.repository.OrderRepository;
import com.mohammad.lychee.lychee.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final OrderRepository orderRepository;

    @Autowired
    public UserController(UserService userService, OrderRepository orderRepository) {
        this.userService = userService;
        this.orderRepository = orderRepository;
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID - Updated for checkout functionality
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        Optional<User> userOptional = userService.getUserById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Create a safe response without password hash
            UserInfoResponse userInfo = new UserInfoResponse();
            userInfo.setUserId(user.getUserId());
            userInfo.setName(user.getName());
            userInfo.setEmail(user.getEmail());
            userInfo.setPhone(user.getPhone());
            userInfo.setRole(user.getRole());

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Sign up
    @PostMapping("/signup")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            if (userService.getUserByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Email already exists
            }
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().build();
        }

        boolean valid = userService.verifyPassword(email, password);
        if (!valid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // Update user
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Integer userId, @RequestBody User user) {
        try {
            user.setUserId(userId);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Soft delete user
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> softDeleteUser(@PathVariable Integer userId) {
        try {
            userService.softDeleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get total spending
    @GetMapping("/{userId}/total-spending")
    public ResponseEntity<Double> getTotalSpending(@PathVariable Integer userId) {
        Optional<Double> total = orderRepository.getTotalSpendingByUserId(userId);
        return ResponseEntity.ok(total.orElse(0.0));
    }

    // Inner class for safe user information response
    public static class UserInfoResponse {
        private Integer userId;
        private String name;
        private String email;
        private String phone;
        private String role;

        // Constructors
        public UserInfoResponse() {}

        public UserInfoResponse(Integer userId, String name, String email, String phone, String role) {
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.role = role;
        }

        // Getters and Setters
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}