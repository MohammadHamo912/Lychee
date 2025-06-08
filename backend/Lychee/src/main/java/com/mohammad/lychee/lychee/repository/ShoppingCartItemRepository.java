package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import com.mohammad.lychee.lychee.service.impl.CheckoutServiceImpl.CartItem;

import java.util.List;
import java.util.Optional;

public interface ShoppingCartItemRepository {

    List<ShoppingCartItem> findAll();

    List<ShoppingCartItem> findByUserId(Integer userId);

    Optional<ShoppingCartItem> findByUserIdAndItemId(Integer userId, Integer itemId);

    ShoppingCartItem save(ShoppingCartItem shoppingCartItem);

    ShoppingCartItem update(ShoppingCartItem item);

    void deleteByUserIdAndItemId(Integer userId, Integer itemId);

    void deleteAllByUserId(Integer userId);

    // NEW METHOD: Get simple cart items with quantities for checkout
    List<CartItem> getCartItemsByUserId(Integer userId);
}