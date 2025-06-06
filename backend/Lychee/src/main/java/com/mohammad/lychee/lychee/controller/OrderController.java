package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
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
        order.setOrderId(id);
        orderService.updateOrder(order);
        return ResponseEntity.noContent().build();
    }

    // Soft delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // Advanced search with filters
    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String role,
                                                    @RequestParam(required = false) String query,
                                                    @RequestParam(required = false) String status,
                                                    @RequestParam(required = false) String startDate,
                                                    @RequestParam(required = false) String endDate,
                                                    @RequestParam(required = false) Integer userId,
                                                    @RequestParam(required = false) Integer storeId) {
        return ResponseEntity.ok(orderService.searchOrders(role, query, status, startDate, endDate, userId, storeId));
    }
}
