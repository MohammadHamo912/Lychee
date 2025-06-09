package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Discount;

import java.util.List;
import java.util.Optional;

public interface DiscountService {

    List<Discount> getAllDiscounts();
    Optional<Discount> getDiscountById(Integer discountId);

    Optional<Discount> getDiscountByCode(String code);
    List<Discount> getActiveDiscounts();
    List<Discount> getValidDiscounts();
    Discount createDiscount(Discount discount);
    Discount updateDiscount(Discount discount);

    void toggleDiscountStatus(Integer discountId);

    void deleteDiscount(Integer discountId);

    boolean isCodeAvailable(String code);

    Optional<Discount> validateDiscountCode(String code);
    List<Discount> getTopDiscountsForCarousel();

}