package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Refund;
import java.util.List;
import java.util.Optional;

public interface RefundRepository {
    List<Refund> findAll();
    Optional<Refund> findById(Integer refundId);
    Optional<Refund> findByTransactionId(Integer transactionId); // Special
    Refund save(Refund refund);
    void delete(Integer refundId);
}
