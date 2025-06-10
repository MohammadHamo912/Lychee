package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.ProductCategory;
import com.mohammad.lychee.lychee.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductCategoryRepositoryImpl implements ProductCategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductCategoryRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ProductCategory> productCategoryRowMapper = (rs, rowNum) -> {
        ProductCategory productCategory = new ProductCategory();
        productCategory.setProduct_id(rs.getInt("product_id"));
        productCategory.setCategory_id(rs.getInt("category_id"));
        return productCategory;
    };

    @Override
    public List<ProductCategory> findAll() {
        String sql = "SELECT * FROM product_category";
        return jdbcTemplate.query(sql, productCategoryRowMapper);
    }

    @Override
    public Optional<ProductCategory> findByProductIdAndCategoryId(Integer productId, Integer categoryId) {
        try {
            String sql = "SELECT * FROM product_category WHERE product_id = ? AND category_id = ?";
            ProductCategory productCategory = jdbcTemplate.queryForObject(sql, productCategoryRowMapper, productId, categoryId);
            return Optional.ofNullable(productCategory);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ProductCategory> findByProductId(Integer productId) {
        String sql = "SELECT * FROM product_category WHERE product_id = ?";
        return jdbcTemplate.query(sql, productCategoryRowMapper, productId);
    }

    @Override
    public List<ProductCategory> findByCategoryId(Integer categoryId) {
        String sql = "SELECT * FROM product_category WHERE category_id = ?";
        return jdbcTemplate.query(sql, productCategoryRowMapper, categoryId);
    }

    @Override
    public ProductCategory save(ProductCategory productCategory) {
        String sql = "INSERT INTO product_category (product_id, category_id) VALUES (?, ?) " +
                "ON DUPLICATE KEY UPDATE product_id = product_id";

        jdbcTemplate.update(sql,
                productCategory.getProduct_id(),
                productCategory.getCategory_id());

        return productCategory;
    }

    @Override
    public void delete(Integer productId, Integer categoryId) {
        String sql = "DELETE FROM product_category WHERE product_id = ? AND category_id = ?";
        jdbcTemplate.update(sql, productId, categoryId);
    }
}