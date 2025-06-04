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
            String sql = "SELECT * FROM Item WHERE LOWER(name) LIKE LOWER(CONCAT('%', ?, '%')) AND deleted_at IS NULL";
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
        String sql = "SELECT * FROM Item WHERE price BETWEEN ? AND ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, minPrice, maxPrice);
    }

    @Override
    public List<Item> findTrendingItems() {
        String sql = """
    SELECT i.* FROM Item i 
    INNER JOIN (
        SELECT oi.Item_ID, SUM(oi.quantity) as total_sold
        FROM OrderItem oi 
        INNER JOIN `Order` o ON oi.order_id = o.order_id  
        WHERE oi.created_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 45 DAY) 
        AND oi.deleted_at IS NULL 
        AND o.deleted_at IS NULL
        AND o.status IN ('completed', 'processing','shipped','completed')
        GROUP BY oi.Item_ID 
        ORDER BY total_sold DESC 
        LIMIT 5
    ) trending ON i.Item_ID = trending.Item_ID
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

        String sql = "SELECT * FROM Item WHERE Item_ID IN (" + inClause + ") AND deleted_at IS NULL";

        return jdbcTemplate.query(sql, itemRowMapper, itemIds.toArray());
    }

    @Override
    public List<Item> findActiveItems() {
        return findAll(); // Same as findAll() - returns items where deleted_at IS NULL
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
        if (item.getItemId() == 0) {
            return insert(item);
        } else {
            return update(item);
        }
    }

    private Item insert(Item item) {
        String sql = "INSERT INTO Item (Store_ID, Product_Variant_ID, price, stockQuantity, rating, discount, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, item.getStoreId());
            ps.setInt(2, item.getProductVariantId());
            ps.setBigDecimal(3, item.getPrice());
            ps.setInt(4, item.getStockQuantity());
            ps.setFloat(5, item.getRating() != 0.0f ? item.getRating() : 0.0f);
            ps.setBigDecimal(6, item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO);
            ps.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);

        item.setItemId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        item.setCreatedAt(LocalDateTime.now());
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
    @Override
    public List<Item> findItemsByStoreId(Integer storeId) {
        String sql = "SELECT * FROM Item WHERE Store_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, itemRowMapper, storeId);
    }
    @Override
    public List<Item> searchItemsByStoreIdAndName(Integer storeId, String query) {
        String sql = """
        SELECT i.* FROM Item i
        JOIN ProductVariant pv ON i.Product_Variant_ID = pv.Product_Variant_ID
        JOIN Product p ON pv.Product_ID = p.Product_ID
        WHERE i.Store_ID = ?
        AND LOWER(p.name) LIKE LOWER(CONCAT('%', ?, '%'))
        AND i.deleted_at IS NULL
    """;

        return jdbcTemplate.query(sql, itemRowMapper, storeId, query);
    }
}