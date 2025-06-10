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
import java.util.stream.Collectors;

@Repository
public class ItemRepositoryImpl implements ItemRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ItemRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Item> itemRowMapper = (rs, rowNum) -> {
        Item item = new Item();
        item.setItem_id(rs.getInt("item_id"));
        item.setStore_id(rs.getInt("store_id"));
        item.setProduct_variant_id(rs.getInt("product_variant_id"));
        item.setPrice(rs.getBigDecimal("price"));
        item.setStock_quantity(rs.getInt("stock_quantity"));
        item.setRating(rs.getFloat("rating"));
        item.setDiscount(rs.getBigDecimal("discount"));
        item.setCreated_at(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        item.setUpdated_at(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        item.setDeleted_at(rs.getTimestamp("deleted_at") != null ?
                rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        return item;
    };

    @Override
    public List<Item> findAll() {
        String sql = "SELECT * FROM item WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper);
    }

    @Override
    public Optional<Item> findById(Integer id) {
        try {
            String sql = "SELECT * FROM item WHERE item_id = ? AND deleted_at IS NULL";
            Item item = jdbcTemplate.queryForObject(sql, itemRowMapper, id);
            return Optional.ofNullable(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Item> findByName(String name) {
        try {
            String sql = "SELECT * FROM item WHERE LOWER(name) LIKE LOWER(CONCAT('%', ?, '%')) AND deleted_at IS NULL";
            Item item = jdbcTemplate.queryForObject(sql, itemRowMapper, name);
            return Optional.ofNullable(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Item> findByStoreId(Integer storeId) {
        String sql = "SELECT * FROM item WHERE store_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, storeId);
    }

    @Override
    public List<Item> findByProductVariantId(Integer productVariantId) {
        String sql = "SELECT * FROM item WHERE product_variant_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, productVariantId);
    }

    @Override
    public List<Item> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        String sql = "SELECT * FROM item WHERE price BETWEEN ? AND ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, minPrice, maxPrice);
    }

    @Override
    public List<Item> findTrendingItems() {
        String sql = """
    SELECT i.* FROM item i 
    INNER JOIN (
        SELECT oi.item_id, SUM(oi.quantity) as total_sold
        FROM order_item oi 
        INNER JOIN `order` o ON oi.order_id = o.order_id  
        WHERE oi.created_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 45 DAY) 
        AND oi.deleted_at IS NULL 
        AND o.deleted_at IS NULL
        AND o.status IN ('completed', 'processing','shipped','completed')
        GROUP BY oi.item_id 
        ORDER BY total_sold DESC 
        LIMIT 5
    ) trending ON i.item_id = trending.item_id
    WHERE i.deleted_at IS NULL
    ORDER BY trending.total_sold DESC
    """;
        return jdbcTemplate.query(sql, itemRowMapper);
    }

    @Override
    public List<Item> findByItemIdIn(List<Integer> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) {
            return List.of();
        }

        String inClause = itemIds.stream()
                .map(id -> "?")
                .collect(Collectors.joining(","));

        String sql = "SELECT * FROM item WHERE item_id IN (" + inClause + ") AND deleted_at IS NULL";

        return jdbcTemplate.query(sql, itemRowMapper, itemIds.toArray());
    }

    @Override
    public List<Item> findActiveItems() {
        return findAll(); // Same as findAll() - returns items where deleted_at IS NULL
    }

    @Override
    public List<Item> findByProductId(Integer productId) {
        String sql = "SELECT i.* FROM item i " +
                "JOIN product_variant pv ON i.product_variant_id = pv.product_variant_id " +
                "WHERE pv.product_id = ? AND i.deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, productId);
    }

    @Override
    public Item save(Item item) {
        if (item.getItem_id() == 0) {
            return insert(item);
        } else {
            return update(item);
        }
    }

    private Item insert(Item item) {
        String sql = "INSERT INTO Item (store_id, product_variant_id, price, stock_quantity, rating, discount, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, item.getStore_id());
            ps.setInt(2, item.getProduct_variant_id());
            ps.setBigDecimal(3, item.getPrice());
            ps.setInt(4, item.getStock_quantity());
            ps.setFloat(5, item.getRating() != 0.0f ? item.getRating() : 0.0f);
            ps.setBigDecimal(6, item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO);
            ps.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);

        item.setItem_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        item.setCreated_at(LocalDateTime.now());
        return item;
    }

    private Item update(Item item) {
        String sql = "UPDATE item SET store_id = ?, product_variant_id = ?, price = ?, " +
                "stock_quantity = ?, rating = ?, discount = ?, updated_at = ? " +
                "WHERE item_id = ?";

        jdbcTemplate.update(sql,
                item.getStore_id(),
                item.getProduct_variant_id(),
                item.getPrice(),
                item.getStock_quantity(),
                item.getRating(),
                item.getDiscount(),
                Timestamp.valueOf(LocalDateTime.now()),
                item.getItem_id());

        return findById(item.getItem_id()).orElse(item);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Item WHERE item_id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE item SET deleted_at = ? WHERE item_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }
    @Override
    public List<Item> findItemsByStoreId(Integer storeId) {
        String sql = "SELECT * FROM Item WHERE store_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, storeId);
    }
    @Override
    public List<Item> searchItemsByStoreIdAndName(Integer storeId, String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return List.of(); // Return empty if query is blank
            }

            String sql = """
            SELECT i.* FROM Item i
            JOIN productvariant pv ON i.product_variant_id = pv.product_variant_id
            JOIN product p ON pv.product_id = p.product_id
            WHERE i.store_id = ?
              AND LOWER(p.name) LIKE ?
              AND i.deleted_at IS NULL
        """;

            String safeQuery = "%" + query.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "") + "%";
            return jdbcTemplate.query(sql, itemRowMapper, storeId, safeQuery);
        } catch (Exception e) {
            System.err.println("❌ Error in searchItemsByStoreIdAndName:");
            e.printStackTrace();
            return List.of(); // fallback
        }
    }
    @Override
    public boolean updateStock(Integer itemId, Integer quantity) {
        String sql = "UPDATE item SET stock_quantity = stock_quantity - ? WHERE item_id = ? AND stock_quantity >= ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql, quantity, itemId, quantity);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.err.println("Error updating stock: " + e.getMessage());
            return false;
        }
    }

}