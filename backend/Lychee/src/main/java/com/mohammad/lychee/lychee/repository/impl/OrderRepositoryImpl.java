// --- OrderRepositoryImpl.java (Fully Fixed) ---
package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrderRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Order> orderRowMapper = (rs, rowNum) -> {
        Order order = new Order();
        order.setOrderId(rs.getInt("order_id"));
        order.setUserId(rs.getInt("user_ID"));
        order.setShippingAddressId(rs.getInt("shippingAddress_ID"));

        if (rs.getObject("Discount_ID") != null) {
            order.setDiscountId(rs.getInt("Discount_ID"));
        }

        order.setStatus(rs.getString("status"));
        order.setTotalPrice(rs.getBigDecimal("total_price"));
        order.setShippingFee(rs.getBigDecimal("shipping_fee"));
        order.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            order.setUpdatedAt(updatedAt.toLocalDateTime());
        }

        Timestamp deletedAt = rs.getTimestamp("deleted_at");
        if (deletedAt != null) {
            order.setDeletedAt(deletedAt.toLocalDateTime());
        }

        if (hasColumn(rs, "customerName")) {
            order.setCustomerName(rs.getString("customerName"));
        }

        return order;
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
        item.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return item;
    };

    private boolean hasColumn(ResultSet rs, String columnName) {
        try {
            rs.findColumn(columnName);
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    @Override
    public List<Order> findAll() {
        String sql = "SELECT * FROM `Order` WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper);
    }

    @Override
    public Optional<Order> findById(Integer orderId) {
        String sql = "SELECT o.*, u.name AS customerName FROM `Order` o JOIN `User` u ON o.user_ID = u.User_ID WHERE o.order_id = ? AND o.deleted_at IS NULL";
        List<Order> orders = jdbcTemplate.query(sql, orderRowMapper, orderId);
        return orders.isEmpty() ? Optional.empty() : Optional.of(orders.get(0));
    }

    @Override
    public List<Order> findByUserId(Integer userId) {
        String sql = "SELECT o.*, u.name AS customerName FROM `Order` o JOIN `User` u ON o.user_ID = u.User_ID WHERE o.user_ID = ? AND o.deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper, userId);
    }

    @Override
    public List<OrderItem> findItemsByOrderId(Integer orderId) {
        String sql = "SELECT * FROM OrderItem WHERE order_id = ?";
        return jdbcTemplate.query(sql, orderItemRowMapper, orderId);
    }

    @Override
    public Order save(Order order) {
        String sql = "INSERT INTO `Order` (user_ID, shippingAddress_ID, Discount_ID, status, total_price, shipping_fee, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime now = LocalDateTime.now();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, order.getUserId());
            ps.setInt(2, order.getShippingAddressId());
            ps.setObject(3, order.getDiscountId(), java.sql.Types.INTEGER);
            ps.setString(4, order.getStatus());
            ps.setBigDecimal(5, order.getTotalPrice());
            ps.setBigDecimal(6, order.getShippingFee());
            ps.setTimestamp(7, Timestamp.valueOf(now));
            ps.setTimestamp(8, Timestamp.valueOf(now));
            return ps;
        }, keyHolder);

        order.setOrderId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        return order;
    }

    @Override
    public void update(Order order) {
        String sql = "UPDATE `Order` SET user_ID = ?, shippingAddress_ID = ?, Discount_ID = ?, " +
                "status = ?, total_price = ?, shipping_fee = ? " +
                "WHERE order_id = ?";

        jdbcTemplate.update(sql,
                order.getUserId(),
                order.getShippingAddressId(),
                order.getDiscountId(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getShippingFee(),
                order.getOrderId()
        );
    }

    @Override
    public void softDelete(Integer orderId) {
        String sql = "UPDATE `Order` SET deleted_at = ? WHERE order_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), orderId);
    }

    @Override
    public List<Order> findByStatus(String status) {
        String sql = "SELECT * FROM `Order` WHERE status = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper, status);
    }

    @Override
    public Optional<Double> getTotalSpendingByUserId(Integer userId) {
        String sql = "SELECT COALESCE(SUM(total_price), 0.0) FROM `Order` WHERE user_ID = ? AND deleted_at IS NULL";
        try {
            Double total = jdbcTemplate.queryForObject(sql, Double.class, userId);
            return Optional.ofNullable(total);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.of(0.0);
        }
    }

    @Override
    public List<Order> searchOrders(String role, String query, String status, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder(
                "SELECT o.*, u.name AS customerName FROM `Order` o " +
                        "JOIN `User` u ON o.user_ID = u.User_ID " +
                        "WHERE o.deleted_at IS NULL "
        );

        List<Object> params = new ArrayList<>();

        if ("customer".equals(role)) {
            if (query == null || query.isBlank()) return new ArrayList<>();
            try {
                int userId = Integer.parseInt(query.trim());
                sql.append("AND o.user_ID = ? ");
                params.add(userId);
            } catch (NumberFormatException e) {
                return new ArrayList<>();
            }
        } else {
            if (query != null && !query.isEmpty()) {
                sql.append("AND LOWER(u.name) LIKE ? ");
                params.add("%" + query.toLowerCase() + "%");
            }
        }

        if (status != null && !status.isEmpty()) {
            sql.append("AND o.status = ? ");
            params.add(status);
        }

        if (startDate != null && !startDate.isEmpty()) {
            sql.append("AND DATE(o.created_at) >= ? ");
            params.add(startDate);
        }

        if (endDate != null && !endDate.isEmpty()) {
            sql.append("AND DATE(o.created_at) <= ? ");
            params.add(endDate);
        }

        sql.append("ORDER BY o.created_at DESC");

        return jdbcTemplate.query(sql.toString(), orderRowMapper, params.toArray());
    }
}