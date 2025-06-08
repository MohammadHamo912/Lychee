package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.dto.CheckoutDTO;
import com.mohammad.lychee.lychee.dto.EnrichedItem;
import com.mohammad.lychee.lychee.dto.CartEnrichedItem;
import com.mohammad.lychee.lychee.model.*;
import com.mohammad.lychee.lychee.repository.*;
import com.mohammad.lychee.lychee.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private ShoppingCartItemRepository shoppingCartItemRepository;

    @Autowired
    private EnrichedItemRepository enrichedItemRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public List<CartEnrichedItem> getCartItems(Integer userId) {
        System.out.println("CheckoutService - Getting cart items for user: " + userId);

        // Get cart items with quantities from shopping cart
        List<CartItem> cartItems = shoppingCartItemRepository.getCartItemsByUserId(userId);
        List<CartEnrichedItem> enrichedCartItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            // Get enriched item details
            Optional<EnrichedItem> enrichedItemOpt = enrichedItemRepository.findEnrichedById(cartItem.getItemId());

            if (enrichedItemOpt.isPresent()) {
                // Create cart-specific enriched item
                CartEnrichedItem cartEnrichedItem = new CartEnrichedItem(enrichedItemOpt.get(), cartItem.getQuantity());
                enrichedCartItems.add(cartEnrichedItem);
            }
        }

        System.out.println("CheckoutService - Retrieved " + enrichedCartItems.size() + " cart items");
        return enrichedCartItems;
    }

    @Override
    @Transactional
    public CheckoutDTO.CheckoutResponseDTO processCheckout(CheckoutDTO checkoutData){
        try {
            System.out.println("CheckoutService - Starting checkout process for user: " + checkoutData.getUserId());

            // 1. Get and validate cart items
            List<CartEnrichedItem> cartItems = getCartItems(checkoutData.getUserId());
            if (cartItems.isEmpty()) {
                return new CheckoutDTO.CheckoutResponseDTO(false, null, "Cart is empty");
            }

            // 2. Validate stock availability
            for (CartEnrichedItem item : cartItems) {
                if (item.getStockQuantity() < item.getCartQuantity()) {
                    return new CheckoutDTO.CheckoutResponseDTO(false, null,
                            "Insufficient stock for item: " + item.getName());
                }
            }

            // 3. Create shipping address
            Integer addressId = createShippingAddress(checkoutData.getShippingAddress());
            if (addressId == null) {
                return new CheckoutDTO.CheckoutResponseDTO(false, null, "Failed to create shipping address");
            }

            // 4. Calculate order total
            BigDecimal totalPrice = calculateOrderTotal(cartItems);

            // 5. Create order
            Integer orderId = createOrder(checkoutData.getUserId(), addressId, totalPrice, checkoutData.getOrderNotes());
            if (orderId == null) {
                return new CheckoutDTO.CheckoutResponseDTO(false, null, "Failed to create order");
            }

            // 6. Reserve inventory and create order items
            boolean inventoryReserved = reserveInventoryAndCreateOrderItems(orderId, cartItems);
            if (!inventoryReserved) {
                throw new RuntimeException("Failed to reserve inventory");
            }


            boolean paymentTransaction = processDummyPayment(checkoutData.getUserId(), totalPrice,checkoutData.getPaymentMethod());
            if(!paymentTransaction){
                throw new RuntimeException("Failed to save the paymentTransaction");
            }


            // 8. Clear shopping cart
            clearShoppingCart(checkoutData.getUserId(), cartItems);

            // 10. Update order status
            updateOrderStatus(orderId, "confirmed");


            System.out.println("CheckoutService - Checkout completed successfully. Order ID: " + orderId);
            return new CheckoutDTO.CheckoutResponseDTO(true, orderId, "Order processed successfully (payment skipped for testing)");

        } catch (Exception e) {
            System.err.println("CheckoutService - Checkout failed: " + e.getMessage());
            e.printStackTrace();
            return new CheckoutDTO.CheckoutResponseDTO(false, null, "Checkout failed: " + e.getMessage());
        }
    }

    private boolean processDummyPayment(Integer orderId, BigDecimal amount,String paymentMethod) {
        try {
            // Create payment transaction
            PaymentTransaction transaction = new PaymentTransaction();
            transaction.setOrderId(orderId);
            transaction.setAmount(amount);
            transaction.setStatus(paymentMethod.equals("creditCard") ? "completed": "pending");
            transaction.setCreatedAt(LocalDateTime.now());
            transaction.setTransactionReference(paymentMethod.equals("creditCard") ? "creditCard" : "cashOnDelivery");

            paymentTransactionRepository.save(transaction);
            return true;
        } catch (Exception e) {
            System.err.println("CheckoutService - Error processing payment: " + e.getMessage());
            return false;
        }

    }

    @Override
    public BigDecimal calculateOrderTotal(List<CartEnrichedItem> items) {
        BigDecimal total = BigDecimal.ZERO;

        for (CartEnrichedItem item : items) {
            total = total.add(item.getCartItemTotal());
        }

        return total;
    }

    // Private helper methods using repository pattern
    private Integer createShippingAddress(CheckoutDTO.ShippingAddressDTO addressData) {
        try {
            System.out.println("CheckoutService - Creating address: " +
                    addressData.getCity() + ", " + addressData.getStreet() + ", " + addressData.getBuilding());

            Address address = new Address();
            address.setCity(addressData.getCity() != null ? addressData.getCity() : "Default City");
            address.setStreet(addressData.getStreet() != null ? addressData.getStreet() : "Default Street");
            address.setBuilding(addressData.getBuilding() != null ? addressData.getBuilding() : "Default Building");

            Address savedAddress = addressRepository.save(address);

            System.out.println("CheckoutService - Address created with ID: " + savedAddress.getAddressId());

            if (savedAddress.getAddressId() == 0) {
                throw new RuntimeException("Address ID was not generated properly");
            }

            return savedAddress.getAddressId();
        } catch (Exception e) {
            System.err.println("CheckoutService - Error creating address: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private Integer createOrder(Integer userId, Integer addressId, BigDecimal totalPrice, String orderNotes) {
        try {
            Order order = new Order();
            order.setUserId(userId);
            order.setShippingAddressId(addressId);
            order.setStatus("pending");
            order.setTotalPrice(totalPrice);
            order.setShippingFee(BigDecimal.ZERO); // Free shipping
            order.setCreatedAt(LocalDateTime.now());
            order.setUpdatedAt(LocalDateTime.now());

            Order savedOrder = orderRepository.save(order);
            return savedOrder.getOrderId();
        } catch (Exception e) {
            System.err.println("CheckoutService - Error creating order: " + e.getMessage());
            return null;
        }
    }

    private boolean reserveInventoryAndCreateOrderItems(Integer orderId, List<CartEnrichedItem> items) {
        try {
            for (CartEnrichedItem item : items) {
                // Reserve inventory
                boolean stockUpdated = itemRepository.updateStock(item.getItemId(), item.getCartQuantity());
                if (!stockUpdated) {
                    throw new RuntimeException("Failed to reserve stock for item: " + item.getItemId());
                }

                // Create order item
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(orderId);
                orderItem.setItemId(item.getItemId());
                orderItem.setQuantity(item.getCartQuantity());
                orderItem.setPriceAtPurchase(item.getPrice());
                orderItem.setShippingStatus("processing");
                orderItem.setCreatedAt(LocalDateTime.now());
                orderItem.setUpdatedAt(LocalDateTime.now());

                orderItemRepository.save(orderItem);
            }
            return true;
        } catch (Exception e) {
            System.err.println("CheckoutService - Error reserving inventory: " + e.getMessage());
            throw new RuntimeException("Inventory reservation failed", e);
        }
    }


    private void clearShoppingCart(Integer userId, List<CartEnrichedItem> items) {
        for (CartEnrichedItem item : items) {
            shoppingCartItemRepository.deleteByUserIdAndItemId(userId, item.getItemId());
        }
    }

    private void updateOrderStatus(Integer orderId, String status) {
        orderRepository.updateOrderStatus(orderId, status);
    }

    // Inner class for cart items
    public static class CartItem {
        private Integer itemId;
        private Integer quantity;

        public CartItem(Integer itemId, Integer quantity) {
            this.itemId = itemId;
            this.quantity = quantity;
        }

        // Getters and setters
        public Integer getItemId() { return itemId; }
        public void setItemId(Integer itemId) { this.itemId = itemId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}