package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Category;
import com.mohammad.lychee.lychee.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CategoryRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Category> categoryRowMapper = (rs, rowNum) -> {
        Category category = new Category();
        category.setCategory_id(rs.getInt("category_id"));
        category.setName(rs.getString("name"));

        Integer parentId = rs.getInt("parent_id");
        if (!rs.wasNull()) {
            category.setParent_id(parentId);
        }

        category.setLevel(rs.getInt("level"));
        return category;
    };

    @Override
    public List<Category> findAll() {
        String sql = "SELECT * FROM category";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    @Override
    public Optional<Category> findById(Integer id) {
        try {
            String sql = "SELECT * FROM category WHERE category_id = ?";
            Category category = jdbcTemplate.queryForObject(sql, categoryRowMapper, id);
            return Optional.ofNullable(category);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Category> findByParentId(Integer parentId) {
        String sql = "SELECT * FROM category WHERE parent_id = ?";
        return jdbcTemplate.query(sql, categoryRowMapper, parentId);
    }

    @Override
    public List<Category> findRootCategories() {
        String sql = "SELECT * FROM category WHERE parent_id IS NULL";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    @Override
    public Category save(Category category) {
        return update(category);
/*
        if (category.getCategoryId() == null) {
            return insert(category);
        } else {
            return update(category);
        }
  */  }

    private Category insert(Category category) {
        String sql = "INSERT INTO category (name, parent_id, level) VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, category.getName());

            if (category.getParent_id() != null) {
                ps.setInt(2, category.getParent_id());
            } else {
                ps.setNull(2, java.sql.Types.INTEGER);
            }

            ps.setInt(3, category.getLevel());

            return ps;
        }, keyHolder);

        category.setCategory_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return category;
    }

    private Category update(Category category) {
        String sql = "UPDATE category SET name = ?, parent_id = ?, level = ? WHERE category_id = ?";

        jdbcTemplate.update(sql,
                category.getName(),
                category.getParent_id(),
                category.getLevel(),
                category.getCategory_id());

        return findById(category.getCategory_id()).orElse(category);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM category WHERE category_id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Category> findSubcategories(Integer parentId) {
        String sql = "SELECT * FROM category WHERE parent_id = ?";
        return jdbcTemplate.query(sql, categoryRowMapper, parentId);
    }

}