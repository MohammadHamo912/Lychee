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
        orderItem.setOrderId(rs.getInt("order_id"));
        orderItem.setItemId(rs.getInt("item_id"));
        orderItem.setShippingStatus(rs.getString("shipping_status"));
        orderItem.setQuantity(rs.getInt("quantity"));
        orderItem.setPriceAtPurchase(rs.getBigDecimal("price_at_purchase"));
        orderItem.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            orderItem.setUpdatedAt(updatedAt.toLocalDateTime());
        }

        Timestamp deletedAt = rs.getTimestamp("deleted_at");
        if (deletedAt != null) {
            orderItem.setDeletedAt(deletedAt.toLocalDateTime());
        }

        return orderItem;
    };

    @Override
    public List<OrderItem> findAll() {
        String sql = "SELECT * FROM OrderItem WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper);
    }

    @Override
    public Optional<OrderItem> findById(Integer orderId, Integer itemId) {
        String sql = "SELECT * FROM OrderItem WHERE order_id = ? AND item_id = ? AND deleted_at IS NULL";
        List<OrderItem> orderItems = jdbcTemplate.query(sql, orderItemRowMapper, orderId, itemId);
        return orderItems.isEmpty() ? Optional.empty() : Optional.of(orderItems.get(0));
    }

    @Override
    public List<OrderItem> findByOrderId(Integer orderId) {
        String sql = "SELECT * FROM OrderItem WHERE order_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper, orderId);
    }

    @Override
    public OrderItem save(OrderItem orderItem) {
        String sql = "INSERT INTO OrderItem (order_id, item_id, shipping_status, quantity, price_at_purchase) " +
                "VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                orderItem.getOrderId(),
                orderItem.getItemId(),
                orderItem.getShippingStatus(),
                orderItem.getQuantity(),
                orderItem.getPriceAtPurchase()
        );

        return orderItem;
    }

    @Override
    public void update(OrderItem orderItem) {
        String sql = "UPDATE OrderItem SET shipping_status = ?, quantity = ?, price_at_purchase = ? " +
                "WHERE order_id = ? AND item_id = ?";

        jdbcTemplate.update(sql,
                orderItem.getShippingStatus(),
                orderItem.getQuantity(),
                orderItem.getPriceAtPurchase(),
                orderItem.getOrderId(),
                orderItem.getItemId()
        );
    }

    @Override
    public void softDelete(Integer orderId, Integer itemId) {
        String sql = "UPDATE OrderItem SET deleted_at = ? WHERE order_id = ? AND item_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), orderId, itemId);
    }

    @Override
    public List<OrderItem> findByItemId(Integer itemId) {
        String sql = "SELECT * FROM OrderItem WHERE item_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper, itemId);
    }

    @Override
    public List<OrderItem> findByShippingStatus(String shippingStatus) {
        String sql = "SELECT * FROM OrderItem WHERE shipping_status = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderItemRowMapper, shippingStatus);
    }

    @Override
    public Optional<OrderItem> findByOrderIdAndItemId(Integer orderId, Integer itemId) {
        try {
            String sql = "SELECT * FROM OrderItem WHERE order_id = ? AND item_id = ?";
            OrderItem orderItem = jdbcTemplate.queryForObject(sql, orderItemRowMapper, orderId, itemId);
            return Optional.ofNullable(orderItem);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

}