// --- OrderItemRepositoryImpl.java (fixed with all methods) ---
package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderItemRepositoryImpl implements OrderItemRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrderItemRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<OrderItem> orderItemRowMapper = (rs, rowNum) -> {
        OrderItem item = new OrderItem();
        item.setOrderItemId(rs.getInt("order_item_id"));
        item.setOrderId(rs.getInt("order_id"));
        item.setItemId(rs.getInt("item_id"));
        item.setStoreId(rs.getInt("store_id"));
        item.setQuantity(rs.getInt("quantity"));
        item.setPriceAtPurchase(rs.getBigDecimal("price_at_purchase"));
        item.setShippingStatus(rs.getString("shipping_status"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            item.setCreatedAt(createdAt.toLocalDateTime());
        }
        return item;
    };

    @Override
    public List<OrderItem> findAll() {
        String sql = "SELECT * FROM OrderItem";
        return jdbcTemplate.query(sql, orderItemRowMapper);
    }

    @Override
    public Optional<OrderItem> findById(Integer orderId, Integer itemId) {
        String sql = "SELECT * FROM OrderItem WHERE order_id = ? AND item_id = ?";
        List<OrderItem> items = jdbcTemplate.query(sql, orderItemRowMapper, orderId, itemId);
        return items.isEmpty() ? Optional.empty() : Optional.of(items.get(0));
    }

    @Override
    public List<OrderItem> findByOrderId(Integer orderId) {
        String sql = "SELECT * FROM OrderItem WHERE order_id = ?";
        return jdbcTemplate.query(sql, orderItemRowMapper, orderId);
    }

    @Override
    public List<OrderItem> findByStoreId(Integer storeId) {
        String sql = "SELECT * FROM OrderItem WHERE store_id = ?";
        return jdbcTemplate.query(sql, orderItemRowMapper, storeId);
    }

    @Override
    public OrderItem save(OrderItem item) {
        String sql = "INSERT INTO OrderItem (order_id, item_id, store_id, quantity, price_at_purchase, shipping_status, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                item.getOrderId(),
                item.getItemId(),
                item.getStoreId(),
                item.getQuantity(),
                item.getPriceAtPurchase(),
                item.getShippingStatus(),
                Timestamp.valueOf(item.getCreatedAt()),
                Timestamp.valueOf(item.getUpdatedAt() != null ? item.getUpdatedAt() : item.getCreatedAt())
        );
        return item;
    }

    @Override
    public void update(OrderItem item) {
        String sql = "UPDATE OrderItem SET quantity = ?, price_at_purchase = ?, shipping_status = ?, updated_at = NOW() WHERE order_id = ? AND item_id = ?";
        jdbcTemplate.update(sql,
                item.getQuantity(),
                item.getPriceAtPurchase(),
                item.getShippingStatus(),
                item.getOrderId(),
                item.getItemId()
        );
    }

    @Override
    public void softDelete(Integer orderId, Integer itemId) {
        String sql = "UPDATE OrderItem SET shipping_status = 'deleted' WHERE order_id = ? AND item_id = ?";
        jdbcTemplate.update(sql, orderId, itemId);
    }

    @Override
    public List<OrderItem> findByItemId(Integer itemId) {
        String sql = "SELECT * FROM OrderItem WHERE item_id = ?";
        return jdbcTemplate.query(sql, orderItemRowMapper, itemId);
    }

    @Override
    public List<OrderItem> findByShippingStatus(String shippingStatus) {
        String sql = "SELECT * FROM OrderItem WHERE shipping_status = ?";
        return jdbcTemplate.query(sql, orderItemRowMapper, shippingStatus);
    }

    @Override
    public Optional<OrderItem> findByOrderIdAndItemId(Integer orderId, Integer itemId) {
        return findById(orderId, itemId);
    }

    @Override
    public void deleteById(Integer orderItemId) {
        String sql = "DELETE FROM OrderItem WHERE order_item_id = ?";
        jdbcTemplate.update(sql, orderItemId);
    }

    @Override
    public void deleteByOrderId(Integer orderId) {
        String sql = "DELETE FROM OrderItem WHERE order_id = ?";
        jdbcTemplate.update(sql, orderId);
    }
} // end of OrderItemRepositoryImpl.java
