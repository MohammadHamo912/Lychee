package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import java.util.List;
import java.util.Optional;

public interface ShoppingCartItemService {
    List<ShoppingCartItem> getCartItemsByUserId(Integer userId);
    Optional<ShoppingCartItem> getCartItem(Integer userId, Integer itemId);
    ShoppingCartItem addItemToCart(ShoppingCartItem cartItem);
    ShoppingCartItem updateCartItemQuantity(Integer userId, Integer itemId, Integer quantity);
    void removeItemFromCart(Integer userId, Integer itemId);
    void clearCart(Integer userId);
}