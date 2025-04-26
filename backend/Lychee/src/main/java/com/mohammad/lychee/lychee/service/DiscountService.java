package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Discount;
import java.util.List;
import java.util.Optional;

public interface DiscountService {
    List<Discount> getAllDiscounts();
    Optional<Discount> getDiscountById(Integer discountId);
    List<Discount> getValidDiscounts(); // Not expired
    Discount createDiscount(Discount discount);
    Discount updateDiscount(Discount discount);
    void deleteDiscount(Integer discountId);
}
