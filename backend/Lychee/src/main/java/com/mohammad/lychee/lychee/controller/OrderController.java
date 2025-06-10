package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.repository.OrderRepository;
import com.mohammad.lychee.lychee.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    // Get all orders (basic list)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer storeId) {

        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        try {
            Optional<Order> order = orderService.getOrderById(id);
            return order.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get orders for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get order item summaries (uses Map<String, Object>)
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<Map<String, Object>>> getOrderItemSummaries(@PathVariable int orderId) {
        try {
            List<Map<String, Object>> items = orderService.getOrderItemSummaries(orderId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order created = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Update an existing order
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        try {
            order.setOrder_id(id);
            Order updated = orderService.updateOrder(order);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Soft delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Advanced search with filters
    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(
            @RequestParam String role,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(value = "user_id", required = false) Integer user_id,
            @RequestParam(value = "store_id", required = false) Integer store_id
    ) {
        try {
            // Validate role parameter
            if (role == null || role.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Order> orders = orderRepository.searchOrders(
                    role.trim(),
                    query != null ? query.trim() : null,
                    status != null ? status.trim() : null,
                    startDate,
                    endDate,
                    user_id,
                    store_id
            );

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error in searchOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable int orderId,
            @RequestBody Map<String, String> body) {

        try {
            String newStatus = body.get("status");

            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status cannot be empty");
            }

            // Validate status values
            String trimmedStatus = newStatus.trim();
            if (!isValidStatus(trimmedStatus)) {
                return ResponseEntity.badRequest().body("Invalid status value");
            }

            orderService.updateOrderStatus(orderId, trimmedStatus);
            return ResponseEntity.ok("Order status updated successfully");

        } catch (Exception e) {
            System.err.println("Error updating order status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update order status");
        }
    }

    // Get order item details by store and order ID
    @GetMapping("/order-items/store/{storeId}/order/{orderId}")
    public ResponseEntity<List<Map<String, Object>>> getOrderItemDetailsByStoreAndOrderId(
            @PathVariable Integer storeId,
            @PathVariable Integer orderId
    ) {
        try {
            if (storeId == null || orderId == null) {
                return ResponseEntity.badRequest().build();
            }

            List<Map<String, Object>> items = orderService.getOrderItemDetailsByStoreAndOrderId(storeId, orderId);
            return ResponseEntity.ok(items);

        } catch (Exception e) {
            System.err.println("Error fetching order items by store: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to validate status values
    private boolean isValidStatus(String status) {
        return status.equals("Confirmed") ||
                status.equals("Shipping") ||
                status.equals("Delivered") ||
                status.equals("Cancelled") ||
                status.equals("Pending");
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Order service is running");
    }
}