package com.mohammad.lychee.lychee.controller;
// fix the endpoints for the trending
import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.service.OrderService;
import com.mohammad.lychee.lychee.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;
    private final OrderItemService orderItemService;

    @Autowired
    public OrderController(OrderService orderService, OrderItemService orderItemService) {
        this.orderService = orderService;
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String role,
                                                    @RequestParam(required = false) Integer userId,
                                                    @RequestParam(required = false) Integer storeId) {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderItemService.getOrderItemsByOrderId(orderId));
    }


    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order created = orderService.createOrder(order);
        return ResponseEntity.ok(created); // Or .created() if you want to return 201
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        order.setOrderId(id);
        orderService.updateOrder(order);
        return ResponseEntity.noContent().build(); // Returns 204
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }


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