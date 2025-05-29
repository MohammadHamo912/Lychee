package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.PaymentMethod;
import com.mohammad.lychee.lychee.repository.PaymentMethodRepository;
import com.mohammad.lychee.lychee.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    @Autowired
    public PaymentMethodServiceImpl(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    @Override
    public Optional<PaymentMethod> getPaymentMethodById(Integer paymentMethodId) {
        return paymentMethodRepository.findById(paymentMethodId);
    }

    @Override
    public List<PaymentMethod> getPaymentMethodsByUserId(Integer userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethodRepository.save(paymentMethod);
    }

    @Override
    @Transactional
    public PaymentMethod updatePaymentMethod(PaymentMethod paymentMethod) {
        Optional<PaymentMethod> existing = paymentMethodRepository.findById(paymentMethod.getPaymentMethodId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("PaymentMethod with ID " + paymentMethod.getPaymentMethodId() + " not found");
        }
        return paymentMethodRepository.save(paymentMethod);
    }

    @Override
    @Transactional
    public void deletePaymentMethod(Integer paymentMethodId) {
        paymentMethodRepository.delete(paymentMethodId);
    }
}
