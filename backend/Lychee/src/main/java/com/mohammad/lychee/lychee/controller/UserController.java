package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.User;
import com.mohammad.lychee.lychee.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for your React app
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Integer userId, @RequestBody User user) {
        try {
            // Make sure the path ID matches the user ID
            user.setUserId(userId);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> softDeleteUser(@PathVariable Integer userId) {
        try {
            userService.softDeleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}/active/{status}")
    public ResponseEntity<User> setUserActiveStatus(
            @PathVariable Integer userId,
            @PathVariable boolean status) {
        try {
            Optional<User> userOptional = userService.getUserById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            if (status) {
                // If activating, make sure deletedAt is null
                user.setDeletedAt(null);
            } else {
                // If deactivating, soft delete the user
                userService.softDeleteUser(userId);
            }

            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}