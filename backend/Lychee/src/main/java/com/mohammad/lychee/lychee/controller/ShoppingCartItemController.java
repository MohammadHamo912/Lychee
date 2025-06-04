package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import com.mohammad.lychee.lychee.service.ShoppingCartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class ShoppingCartItemController {

    private final ShoppingCartItemService shoppingCartItemService;

    @Autowired
    public ShoppingCartItemController(ShoppingCartItemService shoppingCartItemService) {
        this.shoppingCartItemService = shoppingCartItemService;
    }

    // GET /api/cart/{userId} - Get all cart items for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<ShoppingCartItem>> getCartItems(@PathVariable Integer userId) {
        try {
            System.out.println("Getting cart items for user: " + userId);
            List<ShoppingCartItem> cartItems = shoppingCartItemService.getCartItemsByUserId(userId);
            System.out.println("Found " + cartItems.size() + " cart items");
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            System.err.println("Error getting cart items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/cart/{userId}/{itemId} - Get specific cart item
    @GetMapping("/{userId}/{itemId}")
    public ResponseEntity<ShoppingCartItem> getCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer itemId) {
        try {
            System.out.println("Getting cart item for user: " + userId + ", item: " + itemId);
            Optional<ShoppingCartItem> cartItem = shoppingCartItemService.getCartItem(userId, itemId);
            return cartItem.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error getting cart item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/cart - Add item to cart
    @PostMapping
    public ResponseEntity<ShoppingCartItem> addToCart(@RequestBody AddToCartRequest request) {
        try {
            System.out.println("Adding to cart - User: " + request.getUserId() +
                    ", Item: " + request.getItemId() +
                    ", Quantity: " + request.getQuantity());

            // Validate request
            if (request.getUserId() == null || request.getItemId() == null || request.getQuantity() == null) {
                System.err.println("Invalid request: missing required fields");
                return ResponseEntity.badRequest().build();
            }

            if (request.getQuantity() <= 0) {
                System.err.println("Invalid request: quantity must be positive");
                return ResponseEntity.badRequest().build();
            }

            ShoppingCartItem cartItem = new ShoppingCartItem();
            cartItem.setUserId(request.getUserId());
            cartItem.setItemId(request.getItemId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setCreatedAt(LocalDateTime.now());
            cartItem.setUpdatedAt(LocalDateTime.now());

            ShoppingCartItem savedItem = shoppingCartItemService.addItemToCart(cartItem);
            System.out.println("Successfully added item to cart!");
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
        } catch (Exception e) {
            System.err.println("Error adding item to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT /api/cart/{userId}/{itemId} - Update item quantity
    @PutMapping("/{userId}/{itemId}")
    public ResponseEntity<ShoppingCartItem> updateCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer itemId,
            @RequestBody UpdateQuantityRequest request) {
        try {
            System.out.println("Updating cart item - User: " + userId +
                    ", Item: " + itemId +
                    ", New Quantity: " + request.getQuantity());

            ShoppingCartItem updatedItem = shoppingCartItemService.updateCartItemQuantity(
                    userId, itemId, request.getQuantity());
            return ResponseEntity.ok(updatedItem);
        } catch (IllegalArgumentException e) {
            System.err.println("Cart item not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error updating cart item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE /api/cart/{userId}/{itemId} - Remove specific item from cart
    @DeleteMapping("/{userId}/{itemId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Integer userId,
            @PathVariable Integer itemId) {
        try {
            System.out.println("Removing from cart - User: " + userId + ", Item: " + itemId);
            shoppingCartItemService.removeItemFromCart(userId, itemId);
            System.out.println("Successfully removed item from cart");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error removing item from cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE /api/cart/{userId} - Clear entire cart for user
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Integer userId) {
        try {
            System.out.println("Clearing cart for user: " + userId);
            shoppingCartItemService.clearCart(userId);
            System.out.println("Successfully cleared cart");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error clearing cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DTO classes for request bodies
    public static class AddToCartRequest {
        private Integer userId;
        private Integer itemId;
        private Integer quantity;

        // Constructors
        public AddToCartRequest() {}

        public AddToCartRequest(Integer userId, Integer itemId, Integer quantity) {
            this.userId = userId;
            this.itemId = itemId;
            this.quantity = quantity;
        }

        // Getters and setters
        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public Integer getItemId() {
            return itemId;
        }

        public void setItemId(Integer itemId) {
            this.itemId = itemId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        @Override
        public String toString() {
            return "AddToCartRequest{" +
                    "userId=" + userId +
                    ", itemId=" + itemId +
                    ", quantity=" + quantity +
                    '}';
        }
    }

    public static class UpdateQuantityRequest {
        private Integer quantity;

        // Constructors
        public UpdateQuantityRequest() {}

        public UpdateQuantityRequest(Integer quantity) {
            this.quantity = quantity;
        }

        // Getters and setters
        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}