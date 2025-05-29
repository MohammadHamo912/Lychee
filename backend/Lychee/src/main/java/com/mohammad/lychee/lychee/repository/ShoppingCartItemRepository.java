package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import java.util.List;
import java.util.Optional;

public interface ShoppingCartItemRepository {
    List<ShoppingCartItem> findAll();
    List<ShoppingCartItem> findByUserId(Integer userId);
    Optional<ShoppingCartItem> findByUserIdAndItemId(Integer userId, Integer itemId);

    ShoppingCartItem save(ShoppingCartItem sci);

    ShoppingCartItem update(ShoppingCartItem shoppingCartItem);
    void deleteByUserIdAndItemId(Integer userId, Integer itemId);
    void deleteAllByUserId(Integer userId); // Optional helper: empty cart
}
