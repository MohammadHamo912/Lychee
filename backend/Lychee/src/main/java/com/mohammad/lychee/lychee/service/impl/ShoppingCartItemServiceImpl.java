package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import com.mohammad.lychee.lychee.repository.ShoppingCartItemRepository;
import com.mohammad.lychee.lychee.service.ShoppingCartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartItemServiceImpl implements ShoppingCartItemService {

    private final ShoppingCartItemRepository shoppingCartItemRepository;

    @Autowired
    public ShoppingCartItemServiceImpl(ShoppingCartItemRepository shoppingCartItemRepository) {
        this.shoppingCartItemRepository = shoppingCartItemRepository;
    }

    @Override
    public List<ShoppingCartItem> getCartItemsByUserId(Integer userId) {
        return shoppingCartItemRepository.findByUserId(userId);
    }

    @Override
    public Optional<ShoppingCartItem> getCartItem(Integer userId, Integer itemId) {
        return shoppingCartItemRepository.findByUserIdAndItemId(userId, itemId);
    }

    @Override
    @Transactional
    public ShoppingCartItem addItemToCart(ShoppingCartItem cartItem) {
        // Check if item already in cart
        Optional<ShoppingCartItem> existingItem = shoppingCartItemRepository.findByUserIdAndItemId(
                cartItem.getUserId(), cartItem.getItemId());

        if (existingItem.isPresent()) {
            // Update quantity if item already exists
            ShoppingCartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
            shoppingCartItemRepository.update(item);
            return item;
        } else {
            // Add new item to cart
            return shoppingCartItemRepository.update(cartItem);
        }
    }

    @Override
    @Transactional
    public ShoppingCartItem updateCartItemQuantity(Integer userId, Integer itemId, Integer quantity) {
        Optional<ShoppingCartItem> cartItemOptional = shoppingCartItemRepository.findByUserIdAndItemId(userId, itemId);
        if (cartItemOptional.isEmpty()) {
            throw new IllegalArgumentException("Cart item not found for user ID " + userId + " and item ID " + itemId);
        }

        ShoppingCartItem cartItem = cartItemOptional.get();
        cartItem.setQuantity(quantity);
        shoppingCartItemRepository.update(cartItem);
        return cartItem;
    }

    @Override
    @Transactional
    public void removeItemFromCart(Integer userId, Integer itemId) {
        shoppingCartItemRepository.deleteByUserIdAndItemId(userId, itemId);
    }

    @Override
    @Transactional
    public void clearCart(Integer userId) {
        shoppingCartItemRepository.deleteAllByUserId(userId);
    }
}