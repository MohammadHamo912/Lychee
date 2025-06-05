package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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

        // Handle nullable discount_id
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

        return order;
    };

    @Override
    public List<Order> findAll() {
        String sql = "SELECT * FROM `Order` WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper);
    }

    @Override
    public Optional<Order> findById(Integer orderId) {
        String sql = "SELECT * FROM `Order` WHERE order_id = ? AND deleted_at IS NULL";
        List<Order> orders = jdbcTemplate.query(sql, orderRowMapper, orderId);
        return orders.isEmpty() ? Optional.empty() : Optional.of(orders.get(0));
    }

    @Override
    public List<Order> findByUserId(Integer userId) {
        String sql = "SELECT * FROM `Order` WHERE user_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, orderRowMapper, userId);
    }

    @Override
    public Order save(Order order) {
        String sql = "INSERT INTO `Order` (user_ID, shippingAddress_ID, Discount_ID, status, total_price, shipping_fee) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, order.getUserId());
            ps.setInt(2, order.getShippingAddressId());

            if (order.getDiscountId() != null) {
                ps.setInt(3, order.getDiscountId());
            } else {
                ps.setNull(3, java.sql.Types.INTEGER);
            }

            ps.setString(4, order.getStatus());
            ps.setBigDecimal(5, order.getTotalPrice());
            ps.setBigDecimal(6, order.getShippingFee());
            return ps;
        }, keyHolder);

        order.setOrderId(Objects.requireNonNull(keyHolder.getKey()).intValue());
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
            return Optional.of(total);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.of(0.0); // Fallback if query fails
        }
    }
    @Override
    public List<Order> searchOrders(String role, String query, String status, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder(
                "SELECT o.*, u.full_name AS customerName, s.store_name AS storeName " +
                        "FROM `Order` o " +
                        "JOIN `User` u ON o.user_id = u.user_id " +
                        "JOIN `Store` s ON o.store_id = s.store_id " +
                        "WHERE o.deleted_at IS NULL "
        );

        // Parameters
        List<Object> params = new ArrayList<>();

        if (status != null && !status.isEmpty()) {
            sql.append("AND o.status = ? ");
            params.add(status);
        }

        if (query != null && !query.isEmpty()) {
            query = "%" + query.toLowerCase() + "%";
            if ("admin".equals(role)) {
                sql.append("AND (LOWER(u.full_name) LIKE ? OR LOWER(s.store_name) LIKE ?) ");
                params.add(query);
                params.add(query);
            } else if ("storeowner".equals(role)) {
                sql.append("AND LOWER(u.full_name) LIKE ? ");
                params.add(query);
            } else if ("customer".equals(role)) {
                sql.append("AND LOWER(s.store_name) LIKE ? ");
                params.add(query);
            }
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