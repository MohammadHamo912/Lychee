package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Optional<Order> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Integer userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(@PathVariable Integer orderId) {
        return orderService.getOrderItemsByOrderId(orderId);
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
                                    @RequestParam(required = false) String endDate) {
        System.out.printf("SEARCH: role=%s, query=%s, status=%s, start=%s, end=%s%n",
                role, query, status, startDate, endDate);

        return orderService.searchOrders(role, query, status, startDate, endDate);
    }
}