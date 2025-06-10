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

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Get all orders (basic list)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String role,
                                                    @RequestParam(required = false) Integer userId,
                                                    @RequestParam(required = false) Integer storeId) {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get orders for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    // ✅ Get order item summaries (uses Map<String, Object>)
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<Map<String, Object>>> getOrderItemSummaries(@PathVariable int orderId) {
        List<Map<String, Object>> items = orderService.getOrderItemSummaries(orderId);
        return ResponseEntity.ok(items);
    }

    // Create a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order created = orderService.createOrder(order);
        return ResponseEntity.ok(created);
    }

    // Update an existing order
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        order.setOrder_id(id);
        orderService.updateOrder(order);
        return ResponseEntity.noContent().build();
    }

    // Soft delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
    @Autowired
    private OrderRepository orderRepository;

    // Advanced search with filters
    @GetMapping("/orders")
    public List<Order> searchOrders(

            @RequestParam String role,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(value = "user_id", required = false) Integer user_id,
            @RequestParam(value = "store_id", required = false) Integer store_id
    ) {
        return orderRepository.searchOrders(role, query, status, startDate, endDate, user_id, store_id);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable int orderId, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        try {
            orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok("order status updated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update order status");
        }
    }
    @GetMapping("/order-items/store/{storeId}/order/{orderId}")
    public ResponseEntity<List<Map<String, Object>>> getOrderItemDetailsByStoreAndOrderId(
            @PathVariable Integer storeId,
            @PathVariable Integer orderId
    ) {
        List<Map<String, Object>> items = orderService.getOrderItemDetailsByStoreAndOrderId(storeId, orderId);
        return ResponseEntity.ok(items);
    }

}
