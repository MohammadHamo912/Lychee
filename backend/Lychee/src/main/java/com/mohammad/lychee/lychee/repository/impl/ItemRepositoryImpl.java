package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Item;
import com.mohammad.lychee.lychee.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class ItemRepositoryImpl implements ItemRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ItemRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Item> itemRowMapper = (rs, rowNum) -> {
        Item item = new Item();
        item.setItemId(rs.getInt("Item_ID"));
        item.setStoreId(rs.getInt("Store_ID"));
        item.setProductVariantId(rs.getInt("Product_Variant_ID"));
        item.setPrice(rs.getBigDecimal("price"));
        item.setStockQuantity(rs.getInt("stockQuantity"));
        item.setRating(rs.getFloat("rating"));
        item.setDiscount(rs.getBigDecimal("discount"));
        item.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        item.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        item.setDeletedAt(rs.getTimestamp("deleted_at") != null ?
                rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        return item;
    };

    @Override
    public List<Item> findAll() {
        String sql = "SELECT * FROM Item WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper);
    }

    @Override
    public Optional<Item> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Item WHERE Item_ID = ? AND deleted_at IS NULL";
            Item item = jdbcTemplate.queryForObject(sql, itemRowMapper, id);
            return Optional.ofNullable(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Item> findByName(String name) {
        try {
            String sql = "SELECT * FROM Item WHERE Item_Name = ? AND deleted_at IS NULL";
            Item item = jdbcTemplate.queryForObject(sql, itemRowMapper, name);
            return Optional.ofNullable(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Item> findByStoreId(Integer storeId) {
        String sql = "SELECT * FROM Item WHERE Store_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, storeId);
    }

    @Override
    public List<Item> findByProductVariantId(Integer productVariantId) {
        String sql = "SELECT * FROM Item WHERE Product_Variant_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, productVariantId);
    }

    @Override
    public List<Item> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        String sql = "SELECT * FROM Item WHERE price BETWEEN ? AND ?";
        return jdbcTemplate.query(sql, itemRowMapper, minPrice,maxPrice);
    }

    @Override
    public List<Item> findByProductId(Integer productId) {
        String sql = "SELECT i.* FROM Item i " +
                "JOIN ProductVariant pv ON i.Product_Variant_ID = pv.Product_Variant_ID " +
                "WHERE pv.Product_ID = ? AND i.deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, productId);
    }

    @Override
    public Item save(Item item) {
        return update(item);
/*
        if (item.getItemId() == null) {
            return insert(item);
        } else {
            return update(item);
        }
  */  }

    private Item insert(Item item) {
        String sql = "INSERT INTO Item (Store_ID, Product_Variant_ID, price, stockQuantity, rating, discount) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, item.getStoreId());
            ps.setInt(2, item.getProductVariantId());
            ps.setBigDecimal(3, item.getPrice());
            ps.setInt(4, item.getStockQuantity());

            ps.setFloat(5, item.getRating());
/*
            if (item.getRating() != null) {
                ps.setFloat(5, item.getRating());
            } else {
                ps.setFloat(5, 0.0f);
            }
*/
            if (item.getDiscount() != null) {
                ps.setBigDecimal(6, item.getDiscount());
            } else {
                ps.setBigDecimal(6, java.math.BigDecimal.ZERO);
            }

            return ps;
        }, keyHolder);

        item.setItemId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return item;
    }

    private Item update(Item item) {
        String sql = "UPDATE Item SET Store_ID = ?, Product_Variant_ID = ?, price = ?, " +
                "stockQuantity = ?, rating = ?, discount = ?, updated_at = ? " +
                "WHERE Item_ID = ?";

        jdbcTemplate.update(sql,
                item.getStoreId(),
                item.getProductVariantId(),
                item.getPrice(),
                item.getStockQuantity(),
                item.getRating(),
                item.getDiscount(),
                Timestamp.valueOf(LocalDateTime.now()),
                item.getItemId());

        return findById(item.getItemId()).orElse(item);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Item WHERE Item_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE Item SET deleted_at = ? WHERE Item_ID = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }
}