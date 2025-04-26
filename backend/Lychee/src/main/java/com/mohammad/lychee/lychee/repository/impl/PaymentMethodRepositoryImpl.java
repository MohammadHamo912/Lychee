package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.PaymentMethod;
import com.mohammad.lychee.lychee.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class PaymentMethodRepositoryImpl implements PaymentMethodRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PaymentMethodRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<PaymentMethod> paymentMethodRowMapper = (rs, rowNum) -> {
        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setPaymentMethodId(rs.getInt("payment_method_id"));
        paymentMethod.setUserId(rs.getInt("user_id"));
        paymentMethod.setType(rs.getString("type"));
        paymentMethod.setDetails(rs.getString("details"));
        paymentMethod.setDefault(rs.getBoolean("is_default"));
        paymentMethod.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());

        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            paymentMethod.setUpdatedAt(updatedAt.toLocalDateTime());
        }

        return paymentMethod;
    };

    @Override
    public List<PaymentMethod> findAll() {
        String sql = "SELECT * FROM PaymentMethod";
        return jdbcTemplate.query(sql, paymentMethodRowMapper);
    }

    @Override
    public Optional<PaymentMethod> findById(Integer paymentMethodId) {
        String sql = "SELECT * FROM PaymentMethod WHERE payment_method_id = ?";
        List<PaymentMethod> paymentMethods = jdbcTemplate.query(sql, paymentMethodRowMapper, paymentMethodId);
        return paymentMethods.isEmpty() ? Optional.empty() : Optional.of(paymentMethods.get(0));
    }

    @Override
    public List<PaymentMethod> findByUserId(Integer userId) {
        String sql = "SELECT * FROM PaymentMethod WHERE user_id = ?";
        return jdbcTemplate.query(sql, paymentMethodRowMapper, userId);
    }

    @Override
    public PaymentMethod save(PaymentMethod paymentMethod) {
        String sql = "INSERT INTO PaymentMethod (user_id, type, details, is_default) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, paymentMethod.getUserId());
            ps.setString(2, paymentMethod.getType());
            ps.setString(3, paymentMethod.getDetails());
            ps.setBoolean(4, paymentMethod.isDefault());
            return ps;
        }, keyHolder);

        paymentMethod.setPaymentMethodId(Objects.requireNonNull(keyHolder.getKey()).intValue());

        // If this method is set as default, ensure other methods for this user are not default
        if (paymentMethod.isDefault()) {
            updateOtherMethodsToNonDefault(paymentMethod.getUserId(), paymentMethod.getPaymentMethodId());
        }

        return paymentMethod;
    }

    @Override
    public void update(PaymentMethod paymentMethod) {
        String sql = "UPDATE PaymentMethod SET user_id = ?, type = ?, details = ?, is_default = ? " +
                "WHERE payment_method_id = ?";

        jdbcTemplate.update(sql,
                paymentMethod.getUserId(),
                paymentMethod.getType(),
                paymentMethod.getDetails(),
                paymentMethod.isDefault(),
                paymentMethod.getPaymentMethodId()
        );

        // If this method is set as default, ensure other methods for this user are not default
        if (paymentMethod.isDefault()) {
            updateOtherMethodsToNonDefault(paymentMethod.getUserId(), paymentMethod.getPaymentMethodId());
        }
    }

    @Override
    public void delete(Integer paymentMethodId) {
        String sql = "DELETE FROM PaymentMethod WHERE payment_method_id = ?";
        jdbcTemplate.update(sql, paymentMethodId);
    }

    @Override
    public Optional<PaymentMethod> findDefaultForUser(Integer userId) {
        String sql = "SELECT * FROM PaymentMethod WHERE user_id = ? AND is_default = TRUE";
        List<PaymentMethod> paymentMethods = jdbcTemplate.query(sql, paymentMethodRowMapper, userId);
        return paymentMethods.isEmpty() ? Optional.empty() : Optional.of(paymentMethods.get(0));
    }

    @Override
    @Transactional
    public void setDefault(Integer paymentMethodId, Integer userId) {
        // First set all payment methods for this user to not default
        String sqlUpdateAll = "UPDATE PaymentMethod SET is_default = FALSE WHERE user_id = ?";
        jdbcTemplate.update(sqlUpdateAll, userId);

        // Then set the specified payment method as default
        String sqlUpdateOne = "UPDATE PaymentMethod SET is_default = TRUE WHERE payment_method_id = ?";
        jdbcTemplate.update(sqlUpdateOne, paymentMethodId);
    }

    private void updateOtherMethodsToNonDefault(Integer userId, Integer currentMethodId) {
        String sql = "UPDATE PaymentMethod SET is_default = FALSE WHERE user_id = ? AND payment_method_id != ?";
        jdbcTemplate.update(sql, userId, currentMethodId);
    }
}