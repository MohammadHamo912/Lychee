package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.dto.CheckoutDTO;
import com.mohammad.lychee.lychee.dto.EnrichedItem;
import com.mohammad.lychee.lychee.model.*;
import com.mohammad.lychee.lychee.repository.*;
import com.mohammad.lychee.lychee.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private ShoppingCartItemRepository shoppingCartItemRepository;

    @Autowired
    private EnrichedItemRepository enrichedItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private WarehouseInventoryRepository warehouseInventoryRepository;

    @Override
    public List<EnrichedItem> getCartItems(Integer userId) {
        try {
            System.out.println("CheckoutService - Getting cart items for user: " + userId);

            // Get cart items from shopping cart
            List<ShoppingCartItem> cartItems = shoppingCartItemRepository.findByUserId(userId);

            if (cartItems.isEmpty()) {
                System.out.println("CheckoutService - No cart items found for user: " + userId);
                return List.of();
            }

            // Extract item IDs
            List<Integer> itemIds = cartItems.stream()
                    .map(ShoppingCartItem::getItemId)
                    .toList();

            // Get enriched items
            List<EnrichedItem> enrichedItems = enrichedItemRepository.findEnrichedByIds(itemIds);

            // Add quantity from cart to enriched items
            for (EnrichedItem enrichedItem : enrichedItems) {
                cartItems.stream()
                        .filter(cartItem -> cartItem.getItemId().equals(enrichedItem.getItemId()))
                        .findFirst()
                        .ifPresent(cartItem -> {
                            // Note: You might want to add a cartQuantity field to EnrichedItem
                            // For now, we'll use a different approach in the frontend
                            System.out.println("CheckoutService - Item " + enrichedItem.getItemId() +
                                    " has quantity: " + cartItem.getQuantity());
                        });
            }

            System.out.println("CheckoutService - Retrieved " + enrichedItems.size() + " enriched cart items");
            return enrichedItems;

        } catch (Exception e) {
            System.err.println("CheckoutService - Error getting cart items: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve cart items", e);
        }
    }

    @Override
    @Transactional
    public CheckoutDTO.CheckoutResponseDTO processCheckout(CheckoutDTO checkoutData) {
        try {
            System.out.println("CheckoutService - Processing checkout for user: " + checkoutData.getUserId());

            // 1. Validate user and cart items
            List<ShoppingCartItem> cartItems = shoppingCartItemRepository.findByUserId(checkoutData.getUserId());
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            // 2. Calculate totals
            BigDecimal subtotal = calculateSubtotal(cartItems);
            BigDecimal tax = BigDecimal.ZERO; // Fixed value as requested
            BigDecimal shippingFee = BigDecimal.ZERO; // Free shipping
            BigDecimal totalPrice = subtotal.add(tax).add(shippingFee);

            System.out.println("CheckoutService - Order totals - Subtotal: " + subtotal +
                    ", Tax: " + tax + ", Total: " + totalPrice);

            // 3. Create shipping address
            Address shippingAddress = createAddressFromShippingDTO(checkoutData.getShippingAddress());
            shippingAddress = addressRepository.save(shippingAddress);
            System.out.println("CheckoutService - Created shipping address with ID: " + shippingAddress.getAddressId());

            // 4. Create billing address (if different)
            Integer billingAddressId = shippingAddress.getAddressId();
            if (checkoutData.getBillingAddress() != null &&
                    !Boolean.TRUE.equals(checkoutData.getBillingAddress().getSameAsShipping())) {
                Address billingAddress = createAddressFromBillingDTO(checkoutData.getBillingAddress());
                billingAddress = addressRepository.save(billingAddress);
                billingAddressId = billingAddress.getAddressId();
                System.out.println("CheckoutService - Created separate billing address with ID: " + billingAddressId);
            }

            // 5. Create order
            Order order = new Order();
            order.setUserId(checkoutData.getUserId());
            order.setShippingAddressId(shippingAddress.getAddressId());
            order.setStatus("pending");
            order.setTotalPrice(totalPrice);
            order.setShippingFee(shippingFee);

            order = orderRepository.save(order);
            System.out.println("CheckoutService - Created order with ID: " + order.getOrderId());

            // 6. Create order items and update inventory
            for (ShoppingCartItem cartItem : cartItems) {
                // Get item details
                Item item = itemRepository.findById(cartItem.getItemId())
                        .orElseThrow(() -> new RuntimeException("Item not found: " + cartItem.getItemId()));

                // Check stock availability
                if (item.getStockQuantity() < cartItem.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for item: " + cartItem.getItemId());
                }

                // Calculate item total price
                BigDecimal itemPrice = item.getPrice();
                if (item.getDiscount() != null && item.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal discountAmount = itemPrice.multiply(item.getDiscount()).divide(BigDecimal.valueOf(100));
                    itemPrice = itemPrice.subtract(discountAmount);
                }

                // Create order item
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(order.getOrderId());
                orderItem.setItemId(cartItem.getItemId());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPriceAtPurchase(itemPrice);
                orderItem.setShippingStatus("processing");

                orderItemRepository.save(orderItem);

                // Update item stock
                item.setStockQuantity(item.getStockQuantity() - cartItem.getQuantity());
                itemRepository.save(item);

                // Create warehouse inventory entry
                WarehouseInventory warehouseEntry = new WarehouseInventory();
                warehouseEntry.setOrderItemId(order.getOrderId()); // Using orderId as orderItemId for now
                warehouseEntry.setItemId(cartItem.getItemId());
                warehouseEntry.setStatus("pending");
                warehouseInventoryRepository.save(warehouseEntry);

                System.out.println("CheckoutService - Created order item for item: " + cartItem.getItemId() +
                        ", quantity: " + cartItem.getQuantity());
            }

            // 7. Process payment
            PaymentMethod paymentMethod = null;
            if ("creditCard".equals(checkoutData.getPaymentData().getPaymentMethod())) {
                // For now, create a temporary payment method (don't store sensitive data)
                paymentMethod = new PaymentMethod();
                paymentMethod.setUserId(checkoutData.getUserId());
                paymentMethod.setType("creditCard");
                paymentMethod.setDetails("****" + checkoutData.getPaymentData().getCardNumber().substring(
                        Math.max(0, checkoutData.getPaymentData().getCardNumber().length() - 4)));
                paymentMethod.setDefault(false);
                paymentMethod = paymentMethodRepository.save(paymentMethod);
            }

            // Create payment transaction
            PaymentTransaction transaction = new PaymentTransaction();
            transaction.setOrderId(order.getOrderId());
            transaction.setPaymentMethodId(paymentMethod != null ? paymentMethod.getPaymentMethodId() : 1);
            transaction.setAmount(totalPrice);
            transaction.setStatus("completed");
            transaction.setTransactionReference("TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

            transaction = paymentTransactionRepository.save(transaction);
            System.out.println("CheckoutService - Created payment transaction: " + transaction.getTransactionReference());

            // 8. Clear shopping cart - THIS IS THE IMPORTANT PART FOR YOUR REQUIREMENT
            shoppingCartItemRepository.deleteAllByUserId(checkoutData.getUserId());
            System.out.println("CheckoutService - Cleared shopping cart from database for user: " + checkoutData.getUserId());

            // 9. Update order status to confirmed
            order.setStatus("confirmed");
            orderRepository.update(order);

            // Return success response
            CheckoutDTO.CheckoutResponseDTO response = new CheckoutDTO.CheckoutResponseDTO();
            response.setSuccess(true);
            response.setOrderId(order.getOrderId());
            response.setMessage("Order placed successfully");
            response.setTransactionReference(transaction.getTransactionReference());

            System.out.println("CheckoutService - Successfully processed checkout. Order ID: " + order.getOrderId());
            return response;

        } catch (Exception e) {
            System.err.println("CheckoutService - Error processing checkout: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to process checkout: " + e.getMessage(), e);
        }
    }

    @Override
    public CheckoutDTO.CheckoutResponseDTO validatePayment(CheckoutDTO.PaymentDataDTO paymentData, BigDecimal amount) {
        try {
            System.out.println("CheckoutService - Validating payment for amount: " + amount);

            if ("creditCard".equals(paymentData.getPaymentMethod())) {
                // Basic validation
                if (paymentData.getCardNumber() == null || paymentData.getCardNumber().length() < 15) {
                    throw new RuntimeException("Invalid card number");
                }
                if (paymentData.getExpiryDate() == null || !paymentData.getExpiryDate().matches("\\d{2}/\\d{2}")) {
                    throw new RuntimeException("Invalid expiry date");
                }
                if (paymentData.getCvv() == null || paymentData.getCvv().length() < 3) {
                    throw new RuntimeException("Invalid CVV");
                }
            }

            // Simulate successful payment validation
            CheckoutDTO.CheckoutResponseDTO response = new CheckoutDTO.CheckoutResponseDTO();
            response.setSuccess(true);
            response.setMessage("Payment validated successfully");
            response.setTransactionReference("VAL_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

            return response;

        } catch (Exception e) {
            System.err.println("CheckoutService - Payment validation failed: " + e.getMessage());
            CheckoutDTO.CheckoutResponseDTO response = new CheckoutDTO.CheckoutResponseDTO();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    private BigDecimal calculateSubtotal(List<ShoppingCartItem> cartItems) {
        BigDecimal subtotal = BigDecimal.ZERO;

        for (ShoppingCartItem cartItem : cartItems) {
            Item item = itemRepository.findById(cartItem.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + cartItem.getItemId()));

            BigDecimal itemPrice = item.getPrice();

            // Apply discount if exists
            if (item.getDiscount() != null && item.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discountAmount = itemPrice.multiply(item.getDiscount()).divide(BigDecimal.valueOf(100));
                itemPrice = itemPrice.subtract(discountAmount);
            }

            BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        return subtotal;
    }

    private Address createAddressFromShippingDTO(CheckoutDTO.ShippingAddressDTO addressDTO) {
        Address address = new Address();
        address.setCity(addressDTO.getCity());
        // Combine address fields into street
        String street = addressDTO.getAddress();
        if (addressDTO.getApartmentUnit() != null && !addressDTO.getApartmentUnit().trim().isEmpty()) {
            street += ", " + addressDTO.getApartmentUnit();
        }
        address.setStreet(street);
        // Use firstName + lastName as building for now
        address.setBuilding(addressDTO.getFirstName() + " " + addressDTO.getLastName());
        return address;
    }

    private Address createAddressFromBillingDTO(CheckoutDTO.BillingAddressDTO addressDTO) {
        Address address = new Address();
        address.setCity(addressDTO.getCity());
        // Combine address fields into street
        String street = addressDTO.getAddress();
        if (addressDTO.getApartmentUnit() != null && !addressDTO.getApartmentUnit().trim().isEmpty()) {
            street += ", " + addressDTO.getApartmentUnit();
        }
        address.setStreet(street);
        // Use firstName + lastName as building for now
        address.setBuilding(addressDTO.getFirstName() + " " + addressDTO.getLastName());
        return address;
    }
}