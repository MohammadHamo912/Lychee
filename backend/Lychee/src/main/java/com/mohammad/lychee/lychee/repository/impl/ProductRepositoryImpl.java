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

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
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
        product.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        product.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        product.setDeletedAt(rs.getTimestamp("deleted_at") != null ?
                rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        product.setLogo_url(rs.getString("logo_url") != null ?
                rs.getString("logo_url") : null );

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
    public Optional<Product> findByName(String name){
        try {
            String sql = "SELECT * FROM Product WHERE Product_Name = ? AND deleted_at IS NULL";
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
    public Product save(Product product) {
        if (product.getProductId() == 0) {
            return insert(product);
        } else {
            return update(product);
        }
    }


    private Product insert(Product product) {
        String sql = "INSERT INTO Product (barcode, name, description) VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            if (product.getBarcode() != null) {
                ps.setString(1, product.getBarcode());
            } else {
                ps.setNull(1, java.sql.Types.VARCHAR);
            }

            ps.setString(2, product.getName());

            if (product.getDescription() != null) {
                ps.setString(3, product.getDescription());
            } else {
                ps.setNull(3, java.sql.Types.VARCHAR);
            }

            return ps;
        }, keyHolder);

        product.setProductId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return product;
    }

    private Product update(Product product) {
        String sql = "UPDATE Product SET barcode = ?, name = ?, description = ?, ,logo_url = ?, "
                +"updated_at = ? WHERE Product_ID = ?";

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
}
