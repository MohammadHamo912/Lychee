package com.mohammad.lychee.lychee.repository.impl;


import com.mohammad.lychee.lychee.model.ProductVariant;
import com.mohammad.lychee.lychee.repository.ProductVariantRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductVariantRepositoryImpl implements ProductVariantRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductVariantRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<ProductVariant> productVariantRowMapper = (rs, rowNum) -> {
        ProductVariant productVariant = new ProductVariant();
        productVariant.setProductVariantId(rs.getInt("product_variant_id"));
        productVariant.setVariantType(rs.getString("variant_type"));
        // Add more properties here as per your schema
        return productVariant;
    };

    @Override
    public List<ProductVariant> findAll() {
        String sql = "SELECT * FROM ProductVariant WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper);
    }

    @Override
    public Optional<ProductVariant> findById(Integer productVariantId) {
        String sql = "SELECT * FROM ProductVariant WHERE product_variant_id = ? AND deleted_at IS NULL";
        try {
            ProductVariant productVariant = jdbcTemplate.queryForObject(sql, productVariantRowMapper, productVariantId);
            return Optional.ofNullable(productVariant);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ProductVariant> findByProductId(Integer productId) {
        String sql = "SELECT * FROM ProductVariant WHERE product_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, productId);
    }

    @Override
    public ProductVariant save(ProductVariant productVariant) {
        return null;
    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<ProductVariant> findByVariantType(String variantType) {
        String sql = "SELECT * FROM ProductVariant WHERE variant_type = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, variantType);
    }

    @Override
    public void softDelete(Integer productVariantId) {
        String sql = "UPDATE ProductVariant SET deleted_at = NOW() WHERE product_variant_id = ?";
        jdbcTemplate.update(sql, productVariantId);
    }
}
