package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.ProductFeature;
import com.mohammad.lychee.lychee.repository.ProductFeatureRepository;
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
public class ProductFeatureRepositoryImpl implements ProductFeatureRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProductFeatureRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ProductFeature> productFeatureRowMapper = (rs, rowNum) -> {
        ProductFeature productFeature = new ProductFeature();
        productFeature.setFeatureId(rs.getInt("Feature_ID"));
        productFeature.setProductId(rs.getInt("Product_ID"));
        productFeature.setDescription(rs.getString("description"));
        return productFeature;
    };

    @Override
    public List<ProductFeature> findAll() {
        String sql = "SELECT * FROM Product_Features";
        return jdbcTemplate.query(sql, productFeatureRowMapper);
    }

    @Override
    public Optional<ProductFeature> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Product_Features WHERE Feature_ID = ?";
            ProductFeature productFeature = jdbcTemplate.queryForObject(sql, productFeatureRowMapper, id);
            return Optional.ofNullable(productFeature);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ProductFeature> findByProductId(Integer productId) {
        String sql = "SELECT * FROM Product_Features WHERE Product_ID = ?";
        return jdbcTemplate.query(sql, productFeatureRowMapper, productId);
    }

    @Override
    public ProductFeature save(ProductFeature productFeature) {
        return update(productFeature);
/*
        if (productFeature.getFeatureId() == null) {
            return insert(productFeature);
        } else {
            return update(productFeature);
        }
  */  }

    private ProductFeature insert(ProductFeature productFeature) {
        String sql = "INSERT INTO Product_Features (Product_ID, description) VALUES (?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, productFeature.getProductId());
            ps.setString(2, productFeature.getDescription());
            return ps;
        }, keyHolder);

        productFeature.setFeatureId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return productFeature;
    }
    private ProductFeature update(ProductFeature productFeature) {
        String sql = "UPDATE Product_Features SET Product_ID = ?, description = ? WHERE Feature_ID = ?";
        jdbcTemplate.update(sql,
                productFeature.getProductId(),
                productFeature.getDescription(),
                productFeature.getFeatureId());
        return productFeature;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Product_Features WHERE Feature_ID = ?";
        jdbcTemplate.update(sql, id);
    }
}
