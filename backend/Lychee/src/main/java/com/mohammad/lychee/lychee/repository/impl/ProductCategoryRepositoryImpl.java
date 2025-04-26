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
        productCategory.setProductId(rs.getInt("Product_ID"));
        productCategory.setCategoryId(rs.getInt("Category_ID"));
        return productCategory;
    };

    @Override
    public List<ProductCategory> findAll() {
        String sql = "SELECT * FROM ProductCategory";
        return jdbcTemplate.query(sql, productCategoryRowMapper);
    }

    @Override
    public Optional<ProductCategory> findByProductIdAndCategoryId(Integer productId, Integer categoryId) {
        try {
            String sql = "SELECT * FROM ProductCategory WHERE Product_ID = ? AND Category_ID = ?";
            ProductCategory productCategory = jdbcTemplate.queryForObject(sql, productCategoryRowMapper, productId, categoryId);
            return Optional.ofNullable(productCategory);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ProductCategory> findByProductId(Integer productId) {
        String sql = "SELECT * FROM ProductCategory WHERE Product_ID = ?";
        return jdbcTemplate.query(sql, productCategoryRowMapper, productId);
    }

    @Override
    public List<ProductCategory> findByCategoryId(Integer categoryId) {
        String sql = "SELECT * FROM ProductCategory WHERE Category_ID = ?";
        return jdbcTemplate.query(sql, productCategoryRowMapper, categoryId);
    }

    @Override
    public ProductCategory save(ProductCategory productCategory) {
        String sql = "INSERT INTO ProductCategory (Product_ID, Category_ID) VALUES (?, ?) " +
                "ON DUPLICATE KEY UPDATE Product_ID = Product_ID";

        jdbcTemplate.update(sql,
                productCategory.getProductId(),
                productCategory.getCategoryId());

        return productCategory;
    }

    @Override
    public void delete(Integer productId, Integer categoryId) {
        String sql = "DELETE FROM ProductCategory WHERE Product_ID = ? AND Category_ID = ?";
        jdbcTemplate.update(sql, productId, categoryId);
    }
}