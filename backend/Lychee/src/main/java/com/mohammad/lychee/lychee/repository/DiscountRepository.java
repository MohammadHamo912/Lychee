package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Discount;
import java.util.List;
import java.util.Optional;

public interface DiscountRepository {
    List<Discount> findAll();
    Optional<Discount> findById(Integer discountId);
    List<Discount> findValidDiscounts(); // Optional (if you want to find active ones by expirationDate)
    Discount save(Discount discount);
    void delete(Integer discountId);
}
