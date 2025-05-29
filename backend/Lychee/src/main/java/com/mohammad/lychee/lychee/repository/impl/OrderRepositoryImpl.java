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
}