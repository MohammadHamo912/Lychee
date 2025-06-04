package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    @Autowired
    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getItemsByOrderId(@PathVariable Integer orderId) {
        return orderItemService.getOrderItemsByOrderId(orderId);
    }

    @GetMapping("/store/{storeId}")
    public List<OrderItem> getItemsByStoreId(@PathVariable Integer storeId) {
        return orderItemService.getOrderItemsByStoreId(storeId);
    }
}