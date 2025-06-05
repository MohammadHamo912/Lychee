package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.ProductVariant;
import com.mohammad.lychee.lychee.repository.ProductVariantRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ProductVariantRepositoryImpl implements ProductVariantRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductVariantRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ProductVariant> productVariantRowMapper = (rs, rowNum) -> {
        ProductVariant pv = new ProductVariant();
        pv.setProductVariantId(rs.getInt("Product_Variant_ID"));
        pv.setProductId(rs.getInt("Product_ID"));
        pv.setCreatedAt(getLocalDateTime(rs.getTimestamp("created_at")));
        pv.setUpdatedAt(getLocalDateTime(rs.getTimestamp("updated_at")));
        pv.setDeletedAt(getLocalDateTime(rs.getTimestamp("deleted_at")));
        pv.setSize(rs.getString("size"));
        pv.setColor(rs.getString("color"));
        return pv;
    };

    private LocalDateTime getLocalDateTime(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }

    @Override
    public List<ProductVariant> findAll() {
        String sql = "SELECT * FROM ProductVariant WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper);
    }

    @Override
    public Optional<ProductVariant> findById(Integer id) {
        try {
            String sql = "SELECT * FROM ProductVariant WHERE Product_Variant_ID = ? AND deleted_at IS NULL";
            ProductVariant pv = jdbcTemplate.queryForObject(sql, productVariantRowMapper, id);
            return Optional.ofNullable(pv);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    @Override
    public List<ProductVariant> findByProductVariantIdIn(List<Integer> variantIds) {
        if (variantIds == null || variantIds.isEmpty()) {
            return List.of();
        }

        String inClause = variantIds.stream()
                .map(id -> "?")
                .collect(Collectors.joining(","));

        String sql = "SELECT * FROM ProductVariant WHERE Product_Variant_ID IN (" + inClause + ") AND deleted_at IS NULL";

        Object[] params = variantIds.toArray(new Object[0]);

        return jdbcTemplate.query(sql, productVariantRowMapper, params);
    }

    @Override
    public List<ProductVariant> findBySize(String size) {
        String sql = "SELECT * FROM ProductVariant WHERE size = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, size);
    }

    @Override
    public List<ProductVariant> findByColor(String color) {
        String sql = "SELECT * FROM ProductVariant WHERE color = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, color);
    }

    @Override
    public List<ProductVariant> findByProductId(Integer productId) {
        String sql = "SELECT * FROM ProductVariant WHERE Product_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, productId);
    }


    @Override
    public ProductVariant save(ProductVariant pv) {
        if (pv.getProductVariantId() == null || pv.getProductVariantId() == 0) {
            // Insert
            String sql = "INSERT INTO ProductVariant (Product_ID, size, color, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, pv.getProductId());
                ps.setString(2, pv.getSize());
                ps.setString(3, pv.getColor());
                return ps;
            });

            Integer id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
            pv.setProductVariantId(id);
        } else {
            // Update
            String sql = "UPDATE ProductVariant SET Product_ID = ?,size = ?, color = ?, updated_at = NOW() WHERE Product_Variant_ID = ? AND deleted_at IS NULL";
            jdbcTemplate.update(sql,
                    pv.getProductId(),
                    pv.getSize(),
                    pv.getColor(),
                    pv.getProductVariantId());
        }

        return pv;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM ProductVariant WHERE Product_Variant_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE ProductVariant SET deleted_at = NOW() WHERE Product_Variant_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    // Optional: support validation in service layer
    @Override
    public boolean existsById(Integer id) {
        String sql = "SELECT COUNT(*) FROM ProductVariant WHERE Product_Variant_ID = ? AND deleted_at IS NULL";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }
}
