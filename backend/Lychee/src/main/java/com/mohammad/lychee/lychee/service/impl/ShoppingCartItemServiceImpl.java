package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import com.mohammad.lychee.lychee.repository.ShoppingCartItemRepository;
import com.mohammad.lychee.lychee.service.ShoppingCartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        try {
            System.out.println("Service - Getting cart items for user: " + userId);
            List<ShoppingCartItem> items = shoppingCartItemRepository.findByUserId(userId);
            System.out.println("Service - Found " + items.size() + " cart items");
            return items;
        } catch (Exception e) {
            System.err.println("Service - Error getting cart items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Optional<ShoppingCartItem> getCartItem(Integer userId, Integer itemId) {
        try {
            System.out.println("Service - Getting cart item for user: " + userId + ", item: " + itemId);
            Optional<ShoppingCartItem> item = shoppingCartItemRepository.findByUserIdAndItemId(userId, itemId);
            System.out.println("Service - Cart item found: " + item.isPresent());
            return item;
        } catch (Exception e) {
            System.err.println("Service - Error getting cart item: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional
    public ShoppingCartItem addItemToCart(ShoppingCartItem cartItem) {
        try {
            System.out.println("Service - Adding item to cart: User=" + cartItem.getUser_id() +
                    ", Item=" + cartItem.getItem_id() +
                    ", Quantity=" + cartItem.getQuantity());

            // Validate input
            if (cartItem.getUser_id() == null || cartItem.getItem_id() == null || cartItem.getQuantity() == null) {
                throw new IllegalArgumentException("User ID, Item ID, and Quantity cannot be null");
            }

            if (cartItem.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be positive");
            }

            // Check if item already in cart
            Optional<ShoppingCartItem> existingItem = shoppingCartItemRepository.findByUserIdAndItemId(
                    cartItem.getUser_id(), cartItem.getItem_id());

            if (existingItem.isPresent()) {
                System.out.println("Service - Item already exists, updating quantity");
                // Update quantity if item already exists
                ShoppingCartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + cartItem.getQuantity());
                item.setUpdated_at(LocalDateTime.now());
                ShoppingCartItem updatedItem = shoppingCartItemRepository.update(item);
                System.out.println("Service - Successfully updated existing cart item");
                return updatedItem;
            } else {
                System.out.println("Service - Adding new item to cart");
                // Set timestamps for new item
                cartItem.setCreated_at(LocalDateTime.now());
                cartItem.setUpdated_at(LocalDateTime.now());

                // Add new item to cart - USE SAVE, NOT UPDATE!
                ShoppingCartItem savedItem = shoppingCartItemRepository.save(cartItem);
                System.out.println("Service - Successfully added new cart item");
                return savedItem;
            }
        } catch (Exception e) {
            System.err.println("Service - Error adding item to cart: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional
    public ShoppingCartItem updateCartItemQuantity(Integer userId, Integer itemId, Integer quantity) {
        try {
            System.out.println("Service - Updating cart item quantity: User=" + userId +
                    ", Item=" + itemId +
                    ", NewQuantity=" + quantity);

            if (quantity <= 0) {
                throw new IllegalArgumentException("Quantity must be positive");
            }

            Optional<ShoppingCartItem> cartItemOptional = shoppingCartItemRepository.findByUserIdAndItemId(userId, itemId);
            if (cartItemOptional.isEmpty()) {
                throw new IllegalArgumentException("Cart item not found for user ID " + userId + " and item ID " + itemId);
            }

            ShoppingCartItem cartItem = cartItemOptional.get();
            cartItem.setQuantity(quantity);
            cartItem.setUpdated_at(LocalDateTime.now());

            ShoppingCartItem updatedItem = shoppingCartItemRepository.update(cartItem);
            System.out.println("Service - Successfully updated cart item quantity");
            return updatedItem;
        } catch (Exception e) {
            System.err.println("Service - Error updating cart item quantity: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional
    public void removeItemFromCart(Integer userId, Integer itemId) {
        try {
            System.out.println("Service - Removing item from cart: User=" + userId + ", Item=" + itemId);
            shoppingCartItemRepository.deleteByUserIdAndItemId(userId, itemId);
            System.out.println("Service - Successfully removed item from cart");
        } catch (Exception e) {
            System.err.println("Service - Error removing item from cart: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional
    public void clearCart(Integer userId) {
        try {
            System.out.println("Service - Clearing cart for user: " + userId);
            shoppingCartItemRepository.deleteAllByUserId(userId);
            System.out.println("Service - Successfully cleared cart");
        } catch (Exception e) {
            System.err.println("Service - Error clearing cart: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}