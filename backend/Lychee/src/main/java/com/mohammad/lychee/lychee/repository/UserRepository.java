// UserRepository.java
package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    List<User> findAll();
    Optional<User> findById(Integer id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void delete(Integer id);
    void softDelete(Integer id);
    List<User> findByRole(String role);
}
/*
package com.lychee.repository;

import com.lychee.model.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    List<User> findAll();
    Optional<User> findById(Integer id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void delete(Integer id);
    void softDelete(Integer id);
    List<User> findByRole(String role);
}
 */