/*package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.BaseEntity;
import com.mohammad.lychee.lychee.repository.BaseEntityRepository;
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
public class BaseEntityRepositoryImpl<T extends BaseEntity> implements BaseEntityRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public BaseEntityRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<T> userRowMapper = (rs, rowNum) -> {
        T entity = (T) new BaseEntity("",0);
        return entity;
    };

    @Override
    public List<T> findAll() {
        String sql = "SELECT * FROM User WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    @Override
    public Optional<T> findById(Integer id) {
        try {
            String sql = "SELECT * FROM User WHERE User_ID = ? AND deleted_at IS NULL";
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public T save(T entity) {
        if (entity.getId() == 0) {
            return insert(entity);
        }// else
        return update(entity);

        return null;
    }


    private T insert(T entity) {

        String sql = "INSERT INTO User (role, name, email, password_hash, phone) " +
                "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getRole());
            ps.setString(2, user.getName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPasswordHash());
            ps.setString(5, user.getPhone());

            return ps;
        }, keyHolder);

        user.setUserId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return user;
    }

    private User update(User user) {
        String sql = "UPDATE User SET role = ?, name = ?, email = ?, password_hash = ?, " +
                "phone = ?, updated_at = ? WHERE User_ID = ?";

        jdbcTemplate.update(sql,
                user.getRole(),
                user.getName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getPhone(),
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
}*/