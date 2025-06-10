package com.mohammad.lychee.lychee.repository.impl;
/*

    We only submitted this file because it would be large and not understandable to send all the file. If you want us to show
    you the full project we will give you access to the github repository.
    Thanks

 */
import com.mohammad.lychee.lychee.model.User;
import com.mohammad.lychee.lychee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User(
            rs.getInt("user_id"),
                rs.getString("role"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password_hash"),
                rs.getString("phone"),
                rs.getTimestamp("created_at") != null ?
                        rs.getTimestamp("created_at").toLocalDateTime() : null,
                rs.getTimestamp("updated_at") != null ?
                        rs.getTimestamp("updated_at").toLocalDateTime() : (null),
                rs.getTimestamp("deleted_at") != null ?
                        rs.getTimestamp("deleted_at").toLocalDateTime() : null
                );

        return user;
    };

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM `user` WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    @Override
    public Optional<User> findById(Integer id) {
        try {
            // Fixed: Added backticks for consistency
            String sql = "SELECT * FROM `user` WHERE user_id = ? AND deleted_at IS NULL";
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        try {
            String sql = "SELECT * FROM `user` WHERE email = ? AND deleted_at IS NULL";
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<User> findByRole(String role) {
        String sql = "SELECT * FROM `user` WHERE role = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, userRowMapper, role);
    }
    @Override
    public User save(User user) {
        if (user.getUser_id() == 0) {
            return insert(user);
        }// else
        return update(user);

    }

    private User insert(User user) {
        String sql = "INSERT INTO `user` (role, name, email, password_hash, phone) " +
                "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getRole());
            ps.setString(2, user.getName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPassword_hash());
            ps.setString(5, user.getPhone());

            return ps;
        }, keyHolder);

        user.setUser_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return user;
    }

    private User update(User user) {
        String sql = "UPDATE `User` SET role = ?, name = ?, email = ?, password_hash = ?, " +
                "phone = ?, updated_at = ? WHERE user_id = ?";

        jdbcTemplate.update(sql,
                user.getRole(),
                user.getName(),
                user.getEmail(),
                user.getPassword_hash(),
                user.getPhone(),
                Timestamp.valueOf(LocalDateTime.now()),
                user.getUser_id());

        return findById(user.getUser_id()).orElse(user);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM `User` WHERE user_id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE `User` SET deleted_at = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }


}