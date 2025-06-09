package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Discount;

import java.util.List;
import java.util.Optional;

public interface DiscountService {

    /**
     * Get all discounts
     */
    List<Discount> getAllDiscounts();

    /**
     * Get discount by ID
     */
    Optional<Discount> getDiscountById(Integer discountId);

    /**
     * Get discount by code
     */
    Optional<Discount> getDiscountByCode(String code);

    /**
     * Get all active discounts
     */
    List<Discount> getActiveDiscounts();

    /**
     * Get all currently valid discounts (active and within date range)
     */
    List<Discount> getValidDiscounts();

    /**
     * Create a new discount
     */
    Discount createDiscount(Discount discount);

    /**
     * Update an existing discount
     */
    Discount updateDiscount(Discount discount);

    /**
     * Toggle the active status of a discount
     */
    void toggleDiscountStatus(Integer discountId);

    /**
     * Delete a discount by ID
     */
    void deleteDiscount(Integer discountId);

    /**
     * Check if a discount code is available
     */
    boolean isCodeAvailable(String code);

    /**
     * Validate a discount code and return the discount if valid
     */
    Optional<Discount> validateDiscountCode(String code);
}