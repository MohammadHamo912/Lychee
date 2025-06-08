package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.dto.CheckoutDTO;
import com.mohammad.lychee.lychee.dto.CartEnrichedItem;

import java.math.BigDecimal;
import java.util.List;
public interface CheckoutService {

    //Get user's cart items with full product details and cart quantities
    List<CartEnrichedItem> getCartItems(Integer userId);

    //Process complete checkout with dummy payment
    CheckoutDTO.CheckoutResponseDTO processCheckout(CheckoutDTO checkoutData);

    //Calculate order total with discounts
    BigDecimal calculateOrderTotal(List<CartEnrichedItem> items);
}