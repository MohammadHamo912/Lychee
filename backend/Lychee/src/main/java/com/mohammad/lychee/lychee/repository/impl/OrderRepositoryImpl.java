// --- OrderRepositoryImpl.java (fixed) ---
package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrderRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Order> orderRowMapper = new RowMapper<>() {
        @Override
        public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
            Order order = new Order();
            order.setOrderId(rs.getInt("order_id"));
            order.setUserId(rs.getInt("user_id"));
            order.setShippingAddressId(rs.getInt("shipping_address_id"));
            order.setDiscountId(rs.getObject("discount_id") != null ? rs.getInt("discount_id") : null);
            order.setStatus(rs.getString("status"));
            order.setTotalPrice(rs.getBigDecimal("total_price"));
            order.setShippingFee(rs.getBigDecimal("shipping_fee"));order.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
            order.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            order.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
            order.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            return order;
        }
    };

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
        if (createdAt != null) item.setCreatedAt(createdAt.toLocalDateTime());
        return item;
    };

    @Override
    public List<Order> findAll() {
        return jdbcTemplate.query("SELECT * FROM `Order` WHERE deleted_at IS NULL", orderRowMapper);
    }

    @Override
    public Optional<Order> findById(Integer orderId) {
        String sql = "SELECT * FROM `Order` WHERE order_id = ? AND deleted_at IS NULL";
        List<Order> orders = jdbcTemplate.query(sql, orderRowMapper, orderId);
        return orders.stream().findFirst();
    }

    @Override
    public List<Order> findByUserId(Integer userId) {
        String sql = "SELECT * FROM `Order` WHERE user_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper, userId);
    }

    @Override
    public List<Order> findByStoreId(Integer storeId) {
        String sql = "SELECT DISTINCT o.* FROM `Order` o JOIN OrderItem oi ON o.order_id = oi.order_id WHERE oi.store_id = ? AND o.deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper, storeId);
    }

    @Override
    public List<OrderItem> findItemsByOrderId(Integer orderId) {
        String sql = "SELECT * FROM OrderItem WHERE order_id = ?";
        return jdbcTemplate.query(sql, orderItemRowMapper, orderId);
    }

    @Override
    public Order save(Order order) {
        String sql = "INSERT INTO `Order` (user_id, shipping_address_id, discount_id, status, total_price, shipping_fee, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
        jdbcTemplate.update(sql,
                order.getUserId(),
                order.getShippingAddressId(),
                order.getDiscountId(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getShippingFee()
        );
        return order;
    }

    @Override
    public void update(Order order) {
        String sql = "UPDATE `Order` SET status = ?, updated_at = NOW() WHERE order_id = ?";
        jdbcTemplate.update(sql, order.getStatus(), order.getOrderId());
    }

    @Override
    public void softDelete(Integer orderId) {
        String sql = "UPDATE `Order` SET deleted_at = NOW() WHERE order_id = ?";
        jdbcTemplate.update(sql, orderId);
    }

    @Override
    public List<Order> findByStatus(String status) {
        String sql = "SELECT * FROM `Order` WHERE status = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper, status);
    }

    @Override
    public Optional<BigDecimal> getTotalSpendingByUserId(Integer userId) {
        String sql = "SELECT SUM(total_price) FROM `Order` WHERE user_id = ? AND deleted_at IS NULL";
        return Optional.ofNullable(jdbcTemplate.queryForObject(sql, BigDecimal.class, userId));
    }


    @Override
    public List<Order> searchOrders(String role, String query, String status, String startDate, String endDate, Integer userId, Integer storeId) {
        StringBuilder sql = new StringBuilder("SELECT DISTINCT o.* FROM `Order` o");
        List<Object> params = new ArrayList<>();

        if ("storeowner".equalsIgnoreCase(role)) {
            sql.append(" JOIN OrderItem oi ON o.order_id = oi.order_id WHERE oi.store_id = ?");
            params.add(storeId);
        } else {
            sql.append(" WHERE 1=1");
        }

        sql.append(" AND o.deleted_at IS NULL");

        if ("customer".equalsIgnoreCase(role) && userId != null) {
            sql.append(" AND o.user_id = ?");
            params.add(userId);
        }

        if (status != null && !status.isEmpty()) {
            sql.append(" AND o.status = ?");
            params.add(status);
        }
        if (query != null && !query.isEmpty()) {
            sql.append(" AND (CAST(o.order_id AS CHAR) LIKE ?)");
            params.add("%" + query + "%");
        }
        if (startDate != null && !startDate.isEmpty()) {
            sql.append(" AND DATE(o.created_at) >= ?");
            params.add(startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            sql.append(" AND DATE(o.created_at) <= ?");
            params.add(endDate);
        }

        sql.append(" ORDER BY o.created_at DESC");

        return jdbcTemplate.query(sql.toString(), orderRowMapper, params.toArray());
    }
}
