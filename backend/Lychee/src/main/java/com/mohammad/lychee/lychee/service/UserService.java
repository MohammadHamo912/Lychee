package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Integer userId);
    Optional<User> getUserByEmail(String email);
    User createUser(User user);
    User updateUser(User user);
    void softDeleteUser(Integer userId);
    boolean verifyPassword(String email, String password);
    void updatePassword(Integer userId, String newPassword);
    String encodePassword(String rawPassword);
}
