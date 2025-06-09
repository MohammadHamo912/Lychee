package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Discount;

import java.util.List;
import java.util.Optional;

public interface DiscountRepository {

    /**
     * Find all discounts
     */
    List<Discount> findAll();

    /**
     * Find discount by ID
     */
    Optional<Discount> findById(Integer discountId);

    /**
     * Find discount by code
     */
    Optional<Discount> findByCode(String code);

    /**
     * Find all active discounts
     */
    List<Discount> findAllActive();

    /**
     * Find all currently valid discounts (active and within date range)
     */
    List<Discount> findValidDiscounts();

    /**
     * Save a discount (create or update)
     */
    Discount save(Discount discount);

    /**
     * Toggle active status of a discount
     */
    void toggleActive(Integer discountId);

    /**
     * Delete a discount by ID
     */
    void deleteById(Integer discountId);

    /**
     * Check if a discount code exists
     */
    boolean existsByCode(String code);
}