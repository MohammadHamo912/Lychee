package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Refund;
import com.mohammad.lychee.lychee.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RefundRepositoryImpl implements RefundRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RefundRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Refund> rowMapper = (rs, rowNum) -> {
        Refund r = new Refund();
        r.setRefundId(rs.getInt("refund_id"));
        r.setTransactionId(rs.getInt("transaction_id"));
        r.setAmount(rs.getBigDecimal("amount"));
        r.setReason(rs.getString("reason"));
        r.setStatus(rs.getString("status"));
        r.setProcessedAt(rs.getTimestamp("processed_at").toLocalDateTime());
        r.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        r.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        r.setDeletedAt(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        return r;
    };

    @Override
    public List<Refund> findAll() {
        String sql = "SELECT * FROM Refund";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Optional<Refund> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Refund WHERE refund_id = ?";
            Refund r = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(r);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Refund> findByTransactionId(Integer transactionId) {
        try {
            String sql = "SELECT * FROM Refund WHERE transaction_id = ?";
            Refund r = jdbcTemplate.queryForObject(sql, rowMapper, transactionId);
            return Optional.ofNullable(r);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Refund save(Refund refund) {
        String sql = "INSERT INTO Refund (transaction_id, amount, reason, status, processed_at, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                refund.getTransactionId(),
                refund.getAmount(),
                refund.getReason(),
                refund.getStatus(),
                refund.getProcessedAt(),
                refund.getCreatedAt(),
                refund.getUpdatedAt(),
                refund.getDeletedAt()
        );
        return refund;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Refund WHERE refund_id = ?";
        jdbcTemplate.update(sql, id);
    }
}
