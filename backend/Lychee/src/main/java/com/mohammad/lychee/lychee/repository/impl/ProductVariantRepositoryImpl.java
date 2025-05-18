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
        productVariant.setProductVariantId(rs.getInt("Product_Variant_ID"));
        productVariant.setVariantType(rs.getString("variantType"));
        // Add more properties here as per your schema
        return productVariant;
    };

    @Override
    public List<ProductVariant> findAll() {
        String sql = "SELECT * FROM productvariant WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper);
    }

    @Override
    public Optional<ProductVariant> findById(Integer productVariantId) {
        String sql = "SELECT * FROM productvariant WHERE Product_Variant_ID = ? AND deleted_at IS NULL";
        try {
            ProductVariant productVariant = jdbcTemplate.queryForObject(sql, productVariantRowMapper, productVariantId);
            return Optional.ofNullable(productVariant);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ProductVariant> findByProductId(Integer productId) {
        String sql = "SELECT * FROM productvariant WHERE Product_ID = ? AND deleted_at IS NULL";
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
        String sql = "SELECT * FROM productvariant WHERE variantType = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, variantType);
    }

    @Override
    public void softDelete(Integer productVariantId) {
        String sql = "UPDATE productvariant SET deleted_at = NOW() WHERE Product_Variant_ID = ?";
        jdbcTemplate.update(sql, productVariantId);
    }
}
