package com.mohammad.lychee.lychee.repository.impl;

<<<<<<< HEAD

=======
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
import com.mohammad.lychee.lychee.model.ProductVariant;
import com.mohammad.lychee.lychee.repository.ProductVariantRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
=======
import java.sql.Timestamp;
import java.time.LocalDateTime;
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
        productVariant.setVariantType(rs.getString("variantType"));
        // Add more properties here as per your schema
=======
        productVariant.setProductId(rs.getInt("Product_ID"));
        productVariant.setSize(rs.getString("size"));
        productVariant.setColor(rs.getString("color"));
        productVariant.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        productVariant.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        productVariant.setDeletedAt(rs.getTimestamp("deleted_at") != null ?
                rs.getTimestamp("deleted_at").toLocalDateTime() : null);
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
<<<<<<< HEAD
=======
    public List<ProductVariant> findBySize(String size) {
        String sql = "SELECT * FROM productvariant WHERE size = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, size);
    }

    @Override
    public List<ProductVariant> findByColor(String color) {
        String sql = "SELECT * FROM productvariant WHERE color = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, color);
    }

    @Override
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    public List<ProductVariant> findByProductId(Integer productId) {
        String sql = "SELECT * FROM productvariant WHERE Product_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, productId);
    }

    @Override
    public ProductVariant save(ProductVariant productVariant) {
<<<<<<< HEAD
        return null;
=======
        if (productVariant.getProductVariantId() == 0) {
            // Insert new record
            String sql = "INSERT INTO productvariant (Product_ID, size, color, created_at, updated_at) " +
                    "VALUES (?, ?, ?, NOW(), NOW())";
            jdbcTemplate.update(sql,
                    productVariant.getProductId(),
                    productVariant.getSize() != null ? productVariant.getSize() : "default",
                    productVariant.getColor() != null ? productVariant.getColor() : "default");
            // Retrieve the generated ID
            Integer generatedId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
            productVariant.setProductVariantId(generatedId);
        } else {
            // Update existing record
            String sql = "UPDATE productvariant SET Product_ID = ?, size = ?, color = ?, updated_at = NOW() " +
                    "WHERE Product_Variant_ID = ? AND deleted_at IS NULL";
            jdbcTemplate.update(sql,
                    productVariant.getProductId(),
                    productVariant.getSize() != null ? productVariant.getSize() : "default",
                    productVariant.getColor() != null ? productVariant.getColor() : "default",
                    productVariant.getProductVariantId());
        }
        return productVariant;
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    }

    @Override
    public void delete(Integer id) {
<<<<<<< HEAD

    }

    @Override
    public List<ProductVariant> findByVariantType(String variantType) {
        String sql = "SELECT * FROM productvariant WHERE variantType = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, productVariantRowMapper, variantType);
=======
        String sql = "DELETE FROM productvariant WHERE Product_Variant_ID = ?";
        jdbcTemplate.update(sql, id);
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    }

    @Override
    public void softDelete(Integer productVariantId) {
        String sql = "UPDATE productvariant SET deleted_at = NOW() WHERE Product_Variant_ID = ?";
        jdbcTemplate.update(sql, productVariantId);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
