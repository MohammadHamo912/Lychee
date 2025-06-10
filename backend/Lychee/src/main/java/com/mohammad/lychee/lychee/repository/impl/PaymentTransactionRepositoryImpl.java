package com.mohammad.lychee.lychee.repository.impl;


import com.mohammad.lychee.lychee.model.PaymentTransaction;
import com.mohammad.lychee.lychee.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class PaymentTransactionRepositoryImpl implements PaymentTransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PaymentTransactionRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<PaymentTransaction> paymentTransactionRowMapper = (rs, rowNum) -> {
        PaymentTransaction paymentTransaction = new PaymentTransaction();
        paymentTransaction.setPayment_transaction_id(rs.getInt("payment_transaction_id"));
        paymentTransaction.setOrder_id(rs.getInt("order_id"));
        paymentTransaction.setAmount(rs.getBigDecimal("amount"));
        paymentTransaction.setStatus(rs.getString("status"));
        paymentTransaction.setTransaction_reference(rs.getString("transaction_reference"));
        paymentTransaction.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());

        return paymentTransaction;
    };

    @Override
    public List<PaymentTransaction> findAll() {
        String sql = "SELECT * FROM payment_transaction";
        return jdbcTemplate.query(sql, paymentTransactionRowMapper);
    }

    @Override
    public Optional<PaymentTransaction> findById(Integer paymentTransactionId) {
        String sql = "SELECT * FROM payment_transaction WHERE payment_transaction_id = ?";
        List<PaymentTransaction> transactions = jdbcTemplate.query(sql, paymentTransactionRowMapper, paymentTransactionId);
        return transactions.isEmpty() ? Optional.empty() : Optional.of(transactions.get(0));
    }

    @Override
    public List<PaymentTransaction> findByOrderId(Integer orderId) {
        String sql = "SELECT * FROM payment_transaction WHERE order_id = ?";
        return jdbcTemplate.query(sql, paymentTransactionRowMapper, orderId);
    }

    @Override
    public List<PaymentTransaction> findByStatus(String status) {
        String sql = "SELECT * FROM payment_transaction WHERE status = ?";
        return jdbcTemplate.query(sql, paymentTransactionRowMapper, status);
    }

    @Override
    public PaymentTransaction save(PaymentTransaction paymentTransaction) {
        String sql = "INSERT INTO payment_transaction (order_id, amount, status, transaction_reference) " +
                "VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, paymentTransaction.getOrder_id());
            ps.setBigDecimal(2, paymentTransaction.getAmount());
            ps.setString(3, paymentTransaction.getStatus());
            ps.setString(4, paymentTransaction.getTransaction_reference());

            return ps;
        }, keyHolder);

        paymentTransaction.setPayment_transaction_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return paymentTransaction;
    }

    @Override
    public void update(PaymentTransaction paymentTransaction) {
        String sql = "UPDATE payment_transaction SET order_id = ?,  amount = ?, " +
                "status = ?, transaction_reference = ? WHERE payment_transaction_id = ?";

        jdbcTemplate.update(sql,
                paymentTransaction.getOrder_id(),
                paymentTransaction.getAmount(),
                paymentTransaction.getStatus(),
                paymentTransaction.getTransaction_reference(),
                paymentTransaction.getPayment_transaction_id()
        );
    }

    @Override
    public void updateStatus(Integer paymentTransactionId, String status) {
        String sql = "UPDATE payment_transaction SET status = ? WHERE payment_transaction_id = ?";
        jdbcTemplate.update(sql, status, paymentTransactionId);
    }
    @Override
    public void softDelete(Integer id) {
        // Your implementation logic, e.g.:
        String sql = "UPDATE payment_transaction SET deleted = true WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

}