package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.dto.CheckoutDTO;
import com.mohammad.lychee.lychee.dto.EnrichedItem;

import java.math.BigDecimal;
import java.util.List;

public interface CheckoutService {

    /**
     * Get user's cart items with full enriched details
     * @param userId The user ID
     * @return List of enriched cart items
     */
    List<EnrichedItem> getCartItems(Integer userId);

    /**
     * Process complete checkout transaction
     * @param checkoutData The checkout data containing user info, addresses, payment, etc.
     * @return Checkout response with success status and order details
     */
    CheckoutDTO.CheckoutResponseDTO processCheckout(CheckoutDTO checkoutData);

    /**
     * Validate payment details (simulation)
     * @param paymentData The payment data to validate
     * @param amount The transaction amount
     * @return Validation response
     */
    CheckoutDTO.CheckoutResponseDTO validatePayment(CheckoutDTO.PaymentDataDTO paymentData, BigDecimal amount);
}