package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.PaymentTransaction;
import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository {
    List<PaymentTransaction> findAll();
    Optional<PaymentTransaction> findById(Integer paymentTransactionId);
    List<PaymentTransaction> findByOrderId(Integer orderId);
    List<PaymentTransaction> findByStatus(String status);
    PaymentTransaction save(PaymentTransaction paymentTransaction);
    void update(PaymentTransaction paymentTransaction);
    void updateStatus(Integer paymentTransactionId, String status);
    void softDelete(Integer paymentTransactionId);
}