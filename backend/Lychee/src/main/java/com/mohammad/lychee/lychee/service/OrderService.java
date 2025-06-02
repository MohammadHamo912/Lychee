package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Integer orderId);
    List<Order> getOrdersByUserId(Integer userId);
    List<OrderItem> getOrderItemsByOrderId(Integer orderId);
    Order createOrder(Order order);
    void updateOrder(Order order);
    void deleteOrder(Integer orderId);
    List<Order> findByStatus(String status);
    List<Order> searchOrders(String role, String query, String status, String startDate, String endDate, Integer userId, Integer storeId);
    List<Order> getOrdersByStoreId(Integer storeId);
    Optional<BigDecimal> getTotalSpendingByUserId(Integer userId);

}
