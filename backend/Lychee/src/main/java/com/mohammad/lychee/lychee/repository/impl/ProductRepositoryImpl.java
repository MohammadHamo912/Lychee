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
        product.setProduct_id(rs.getInt("product_id"));
        product.setBarcode(rs.getString("barcode"));
        product.setName(rs.getString("name"));
        product.setDescription(rs.getString("description"));
        product.setCreated_at(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        product.setUpdated_at(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
        product.setDeleted_at(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        product.setLogo_url(rs.getString("logo_url"));
        product.setBrand(rs.getString("brand"));

        return product;
    };

    @Override
    public List<Product> findAll() {
        String sql = "SELECT * FROM product WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, productRowMapper);
    }

    @Override
    public Optional<Product> findById(Integer id) {
        try {
            String sql = "SELECT * FROM product WHERE product_id = ? AND deleted_at IS NULL";
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

        String sql = "SELECT * FROM product WHERE product_id IN (" + inClause + ") AND deleted_at IS NULL";

        return jdbcTemplate.query(sql, productRowMapper, productIds.toArray());
    }

    @Override
    public Optional<Product> findByName(String name) {
        try {
            String sql = "SELECT * FROM product WHERE name = ? AND deleted_at IS NULL";
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, name);
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Product> findByBarcode(String barcode) {
        try {
            String sql = "SELECT * FROM product WHERE barcode = ? AND deleted_at IS NULL";
            Product product = jdbcTemplate.queryForObject(sql, productRowMapper, barcode);
            return Optional.ofNullable(product);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Product> findByBrand(String brand) {

            String sql = "SELECT * FROM product WHERE brand = ? AND deleted_at IS NULL";
            return jdbcTemplate.query(sql, productRowMapper, brand);

    }

    @Override
    public List<Product> findByCategoryId(Integer categoryId) {
        String sql = "SELECT p.* FROM product p " +
                "JOIN product_category pc ON p.product_id = pc.product_id " +
                "WHERE pc.category_id = ? AND p.deleted_at IS NULL";
        return jdbcTemplate.query(sql, productRowMapper, categoryId);
    }

    @Override
    public List<Product> findAllById(Iterable<Integer> ids) {
        if (!ids.iterator().hasNext()) return new ArrayList<>();
        String placeholders = String.join(",", idsToPlaceholders(ids));
        String sql = "SELECT * FROM product WHERE product_id IN (" + placeholders + ") AND deleted_at IS NULL";
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
        return product.getProduct_id() == 0 ? insert(product) : update(product);
    }

    private Product insert(Product product) {
        String sql = "INSERT INTO product (barcode, name, description, logo_url, created_at) VALUES (?, ?, ?, ?, ?)";
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

        product.setProduct_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return product;
    }

    private Product update(Product product) {
        String sql = "UPDATE product SET barcode = ?, name = ?, description = ?, logo_url = ?, updated_at = ? WHERE product_id = ?";
        jdbcTemplate.update(sql,
                product.getBarcode(),
                product.getName(),
                product.getDescription(),
                product.getLogo_url(),
                Timestamp.valueOf(LocalDateTime.now()),
                product.getProduct_id());
        return findById(product.getProduct_id()).orElse(product);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM product WHERE product_id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE product SET deleted_at = ? WHERE product_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    @Override
    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM product WHERE product_id = ? AND deleted_at IS NULL";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }
}
