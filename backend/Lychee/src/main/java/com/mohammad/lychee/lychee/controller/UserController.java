package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.User;
import com.mohammad.lychee.lychee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public String createUser(@RequestBody User user) {
        userRepository.save(user);
        return "User created successfully!";
    }
}
