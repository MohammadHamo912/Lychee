package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Discount;

import java.util.List;
import java.util.Optional;

public interface DiscountRepository {
    List<Discount> findAll();
    Optional<Discount> findById(Integer discountId);
    Optional<Discount> findByCode(String code);
    List<Discount> findAllActive();
    List<Discount> findValidDiscounts();

    Discount save(Discount discount);

    void toggleActive(Integer discountId);

    void deleteById(Integer discountId);

    boolean existsByCode(String code);
    List<Discount> findTop3ByOrderByDiscountPercentageDesc();


}