package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.PaymentTransaction;
import com.mohammad.lychee.lychee.repository.PaymentTransactionRepository;
import com.mohammad.lychee.lychee.service.PaymentTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentTransactionServiceImpl implements PaymentTransactionService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    public PaymentTransactionServiceImpl(PaymentTransactionRepository paymentTransactionRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    @Override
    public List<PaymentTransaction> getAllPaymentTransactions() {
        return paymentTransactionRepository.findAll();
    }

    @Override
    public Optional<PaymentTransaction> getPaymentTransactionById(Integer paymentTransactionId) {
        return paymentTransactionRepository.findById(paymentTransactionId);
    }

    @Override
    public List<PaymentTransaction> getByOrderId(Integer orderId) {
        return paymentTransactionRepository.findByOrderId(orderId);
    }

    @Override
    @Transactional
    public PaymentTransaction createPaymentTransaction(PaymentTransaction paymentTransaction) {
        return paymentTransactionRepository.save(paymentTransaction);
    }

    @Override
    @Transactional
    public PaymentTransaction updatePaymentTransaction(PaymentTransaction paymentTransaction) {
        Optional<PaymentTransaction> existing = paymentTransactionRepository.findById(paymentTransaction.getPaymentTransactionId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("PaymentTransaction with ID " + paymentTransaction.getPaymentTransactionId() + " not found");
        }
        return paymentTransactionRepository.save(paymentTransaction);
    }

    @Override
    @Transactional
    public void deletePaymentTransaction(Integer paymentTransactionId) {
        paymentTransactionRepository.softDelete(paymentTransactionId);
    }
}
