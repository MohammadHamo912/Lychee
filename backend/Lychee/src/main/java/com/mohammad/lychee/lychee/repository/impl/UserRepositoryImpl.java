package com.mohammad.lychee.lychee.repository.impl;

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
        User user = new User();
        user.setUserId(rs.getInt("User_ID"));
        user.setRole(rs.getString("role"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setPhone(rs.getString("phone"));
        user.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        user.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        user.setDeletedAt(rs.getTimestamp("deleted_at") != null ?
                rs.getTimestamp("deleted_at").toLocalDateTime() : null);

        Integer defaultAddressId = rs.getInt("default_address_id");
        if (!rs.wasNull()) {
            user.setDefaultAddressId(defaultAddressId);
        }

        return user;
    };

    @Override
    public List<User> findAll() {
        String sql = "SELECT * FROM User WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    @Override
    public Optional<User> findById(Integer id) {
        try {
            String sql = "SELECT * FROM User WHERE User_ID = ? AND deleted_at IS NULL";
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        try {
            String sql = "SELECT * FROM User WHERE email = ? AND deleted_at IS NULL";
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public User save(User user) {
        return update(user);
/*  check this
        if (user.getUserId() == null) {
            return insert(user);
        } else {
            return update(user);
        }*/
    }

    private User insert(User user) {
        String sql = "INSERT INTO User (role, name, email, password_hash, phone, default_address_id) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getRole());
            ps.setString(2, user.getName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getPhone());

            if (user.getDefaultAddressId() != null) {
                ps.setInt(6, user.getDefaultAddressId());
            } else {
                ps.setNull(6, java.sql.Types.INTEGER);
            }

            return ps;
        }, keyHolder);

        user.setUserId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return user;
    }

    private User update(User user) {
        String sql = "UPDATE User SET role = ?, name = ?, email = ?, password_hash = ?, " +
                "phone = ?, default_address_id = ?, updated_at = ? WHERE User_ID = ?";

        jdbcTemplate.update(sql,
                user.getRole(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getPhone(),
                user.getDefaultAddressId(),
                Timestamp.valueOf(LocalDateTime.now()),
                user.getUserId());

        return findById(user.getUserId()).orElse(user);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM User WHERE User_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE User SET deleted_at = ? WHERE User_ID = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    @Override
    public List<User> findByRole(String role) {
        String sql = "SELECT * FROM User WHERE role = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, userRowMapper, role);
    }
}