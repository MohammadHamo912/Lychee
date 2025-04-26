package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {

    List<User> findAll();
    Optional<User> findById(int id);
    void save(User user);
    void update(User user);
    void deleteById(int id);
}
