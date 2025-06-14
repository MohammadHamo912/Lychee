package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
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
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder_id(rs.getInt("order_id"));
        orderItem.setItem_id(rs.getInt("item_id"));
        orderItem.setShipping_status(rs.getString("shipping_status"));
        orderItem.setQuantity(rs.getInt("quantity"));
        orderItem.setPrice_at_purchase(rs.getBigDecimal("price_at_purchase"));
        orderItem.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            orderItem.setUpdated_at(updatedAt.toLocalDateTime());
        }

        Timestamp deletedAt = rs.getTimestamp("deleted_at");
        if (deletedAt != null) {
            orderItem.setDeleted_at(deletedAt.toLocalDateTime());
        }

        return orderItem;
    };

    @Override
    public List<OrderItem> findAll() {
        String sql = "SELECT * FROM order_item WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper);
    }

    @Override
    public Optional<OrderItem> findById(Integer orderId, Integer itemId) {
        String sql = "SELECT * FROM order_item WHERE order_id = ? AND item_id = ? AND deleted_at IS NULL";
        List<OrderItem> orderItems = jdbcTemplate.query(sql, orderItemRowMapper, orderId, itemId);
        return orderItems.isEmpty() ? Optional.empty() : Optional.of(orderItems.get(0));
    }

    @Override
    public List<OrderItem> findByOrderId(Integer orderId) {
        String sql = "SELECT * FROM order_item WHERE order_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper, orderId);
    }

    @Override
    public OrderItem save(OrderItem orderItem) {
        String sql = "INSERT INTO order_item (order_id, item_id, shipping_status, quantity, price_at_purchase) " +
                "VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                orderItem.getOrder_id(),
                orderItem.getItem_id(),
                orderItem.getShipping_status(),
                orderItem.getQuantity(),
                orderItem.getPrice_at_purchase()
        );

        return orderItem;
    }

    @Override
    public void update(OrderItem orderItem) {
        String sql = "UPDATE order_item SET shipping_status = ?, quantity = ?, price_at_purchase = ? " +
                "WHERE order_id = ? AND item_id = ?";

        jdbcTemplate.update(sql,
                orderItem.getShipping_status(),
                orderItem.getQuantity(),
                orderItem.getPrice_at_purchase(),
                orderItem.getOrder_id(),
                orderItem.getItem_id()
        );
    }

    @Override
    public void softDelete(Integer orderId, Integer itemId) {
        String sql = "UPDATE order_item SET deleted_at = ? WHERE order_id = ? AND item_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), orderId, itemId);
    }

    @Override
    public List<OrderItem> findByItemId(Integer itemId) {
        String sql = "SELECT * FROM order_item WHERE item_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper, itemId);
    }

    @Override
    public List<OrderItem> findByShippingStatus(String shippingStatus) {
        String sql = "SELECT * FROM order_item WHERE shipping_status = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper, shippingStatus);
    }

    @Override
    public Optional<OrderItem> findByOrderIdAndItemId(Integer orderId, Integer itemId) {
        try {
            String sql = "SELECT * FROM order_item WHERE order_id = ? AND item_id = ?";
            OrderItem orderItem = jdbcTemplate.queryForObject(sql, orderItemRowMapper, orderId, itemId);
            return Optional.ofNullable(orderItem);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<OrderItem> getOrderItemsByStoreId(Integer storeId) {
        String sql = "SELECT oi.* FROM order_item oi " +
                "JOIN item i ON oi.item_id = i.item_id " +
                "WHERE i.store_id = ? " +
                "AND oi.deleted_at IS NULL " +
                "AND i.deleted_at IS NULL";

        return jdbcTemplate.query(sql, orderItemRowMapper, storeId);
    }

}