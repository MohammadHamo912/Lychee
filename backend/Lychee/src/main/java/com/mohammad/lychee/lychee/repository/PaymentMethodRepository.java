package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.PaymentMethod;
import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository {
    List<PaymentMethod> findAll();
    Optional<PaymentMethod> findById(Integer paymentMethodId);
    List<PaymentMethod> findByUserId(Integer userId);
    PaymentMethod save(PaymentMethod paymentMethod);
    void update(PaymentMethod paymentMethod);
    void delete(Integer paymentMethodId);
    Optional<PaymentMethod> findDefaultForUser(Integer userId);
    void setDefault(Integer paymentMethodId, Integer userId);
}