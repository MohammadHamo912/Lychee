// --- OrderController.java (fixed) ---
package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.service.OrderService;
import com.mohammad.lychee.lychee.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderItemService orderItemService;

    @Autowired
    public OrderController(OrderService orderService, OrderItemService orderItemService) {
        this.orderService = orderService;
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestParam(required = false) String role,
                                    @RequestParam(required = false) Integer userId,
                                    @RequestParam(required = false) Integer storeId) {
        if ("customer".equalsIgnoreCase(role) && userId != null) {
            return orderService.getOrdersByUserId(userId);
        } else if ("storeowner".equalsIgnoreCase(role) && storeId != null) {
            return orderService.getOrdersByStoreId(storeId);
        } else {
            return orderService.getAllOrders();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Integer userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(@PathVariable Integer orderId) {
        return orderItemService.getOrderItemsByOrderId(orderId);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}")
    public void updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        order.setOrderId(id);
        orderService.updateOrder(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
    }

    @GetMapping("/search")
    public List<Order> searchOrders(@RequestParam String role,
                                    @RequestParam(required = false) String query,
                                    @RequestParam(required = false) String status,
                                    @RequestParam(required = false) String startDate,
                                    @RequestParam(required = false) String endDate,
                                    @RequestParam(required = false) Integer userId,
                                    @RequestParam(required = false) Integer storeId) {
        return orderService.searchOrders(role, query, status, startDate, endDate, userId, storeId);
    }
} // end of OrderController.java
