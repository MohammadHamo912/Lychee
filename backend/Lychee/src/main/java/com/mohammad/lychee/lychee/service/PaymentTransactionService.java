package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.PaymentTransaction;
import java.util.List;
import java.util.Optional;

public interface PaymentTransactionService {
    List<PaymentTransaction> getAllPaymentTransactions();
    Optional<PaymentTransaction> getPaymentTransactionById(Integer paymentTransactionId);
    List<PaymentTransaction> getByOrderId(Integer orderId);
    PaymentTransaction createPaymentTransaction(PaymentTransaction paymentTransaction);
    PaymentTransaction updatePaymentTransaction(PaymentTransaction paymentTransaction);
    void deletePaymentTransaction(Integer paymentTransactionId);
}
