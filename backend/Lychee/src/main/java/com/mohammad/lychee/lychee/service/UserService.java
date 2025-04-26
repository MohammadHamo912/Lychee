package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.User;
import java.util.List;

public interface UserService {
    void createUser(User user);
    User getUserById(int id);
    List<User> getAllUsers();
}
