package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.PaymentMethod;
import java.util.List;
import java.util.Optional;

public interface PaymentMethodService {
    List<PaymentMethod> getAllPaymentMethods();
    Optional<PaymentMethod> getPaymentMethodById(Integer paymentMethodId);
    List<PaymentMethod> getPaymentMethodsByUserId(Integer userId);
    PaymentMethod createPaymentMethod(PaymentMethod paymentMethod);
    PaymentMethod updatePaymentMethod(PaymentMethod paymentMethod);
    void deletePaymentMethod(Integer paymentMethodId);
}
