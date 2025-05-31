package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Product;
import com.mohammad.lychee.lychee.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.stream.Collectors;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class ProductRepositoryImpl implements ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Product> productRowMapper = (rs, rowNum) -> {
        Product product = new Product();
        product.setProductId(rs.getInt("Product_ID"));
        product.setBarcode(rs.getString("barcode"));
        product.setName(rs.getString("name"));
        product.setDescription(rs.getString("description"));
        product.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        product.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
        product.setDeletedAt(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        product.setLogo_url(rs.getString("logo_url"));
        return product;
    };

    @Override
    public List<Product> findAll() {
        String sql = "SELECT * FROM Product WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, productRowMapper);
    }

    @Override
    public Optional<Product> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Product WHERE Product_ID = ? AND deleted_at IS NULL";
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, id);
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Product> findByProductIdIn(List<Integer> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }

        String inClause = productIds.stream()
                .map(id -> "?")
                .collect(Collectors.joining(","));

        String sql = "SELECT * FROM Product WHERE Product_ID IN (" + inClause + ") AND deleted_at IS NULL";

        return jdbcTemplate.query(sql, productRowMapper, productIds.toArray());
    }

    @Override
    public Optional<Product> findByName(String name) {
        try {
            String sql = "SELECT * FROM Product WHERE name = ? AND deleted_at IS NULL";
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, name);
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Product> findByBarcode(String barcode) {
        try {
            String sql = "SELECT * FROM Product WHERE barcode = ? AND deleted_at IS NULL";
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, barcode);
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Product> findByCategoryId(Integer categoryId) {
        String sql = "SELECT p.* FROM Product p " +
                "JOIN ProductCategory pc ON p.Product_ID = pc.Product_ID " +
                "WHERE pc.Category_ID = ? AND p.deleted_at IS NULL";
        return jdbcTemplate.query(sql, productRowMapper, categoryId);
    }

    @Override
    public List<Product> findAllById(Iterable<Integer> ids) {
        if (!ids.iterator().hasNext()) return new ArrayList<>();
        String placeholders = String.join(",", idsToPlaceholders(ids));
        String sql = "SELECT * FROM Product WHERE Product_ID IN (" + placeholders + ") AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productRowMapper, idsToParams(ids));
    }

    private List<String> idsToPlaceholders(Iterable<Integer> ids) {
        List<String> placeholders = new ArrayList<>();
        for (Integer id : ids) {
            placeholders.add("?");
        }
        return placeholders;
    }

    private Object[] idsToParams(Iterable<Integer> ids) {
        List<Object> params = new ArrayList<>();
        for (Integer id : ids) {
            params.add(id);
        }
        return params.toArray();
    }

    @Override
    public Product save(Product product) {
        return product.getProductId() == 0 ? insert(product) : update(product);
    }

    private Product insert(Product product) {
        String sql = "INSERT INTO Product (barcode, name, description, logo_url, created_at) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, product.getBarcode());
            ps.setString(2, product.getName());
            ps.setString(3, product.getDescription());
            ps.setString(4, product.getLogo_url());
            ps.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);

        product.setProductId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return product;
    }

    private Product update(Product product) {
        String sql = "UPDATE Product SET barcode = ?, name = ?, description = ?, logo_url = ?, updated_at = ? WHERE Product_ID = ?";
        jdbcTemplate.update(sql,
                product.getBarcode(),
                product.getName(),
                product.getDescription(),
                product.getLogo_url(),
                Timestamp.valueOf(LocalDateTime.now()),
                product.getProductId());
        return findById(product.getProductId()).orElse(product);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Product WHERE Product_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE Product SET deleted_at = ? WHERE Product_ID = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    @Override
    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM Product WHERE Product_ID = ? AND deleted_at IS NULL";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }
}
