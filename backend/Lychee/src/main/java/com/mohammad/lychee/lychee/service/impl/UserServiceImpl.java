package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.User;
import com.mohammad.lychee.lychee.repository.UserRepository;
import com.mohammad.lychee.lychee.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User createUser(User user) {
        // Hash the password before saving
        user.setPassword_hash(passwordEncoder.encode(user.getPassword_hash()));
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUser(User user) {
        // Check if user exists
        Optional<User> existingUser = userRepository.findById(user.getUser_id());
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + user.getUser_id() + " does not exist");
        }

        // Don't update password through this method
        user.setPassword_hash(existingUser.get().getPassword_hash());
        userRepository.save(user);
        return user;
    }

    @Override
    @Transactional
    public void softDeleteUser(Integer userId) {
        userRepository.softDelete(userId);
    }

    @Override
    public boolean verifyPassword(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();
        return passwordEncoder.matches(password, user.getPassword_hash());
    }

    @Override
    @Transactional
    public void updatePassword(Integer userId, String newPassword) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + userId + " does not exist");
        }

        User user = userOptional.get();
        user.setPassword_hash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}