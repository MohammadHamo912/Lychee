package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.model.OrderItem;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    List<Order> findAll();
    Optional<Order> findById(Integer orderId);
    List<Order> findByUserId(Integer userId);
    Order save(Order order);
    void update(Order order);
    void softDelete(Integer orderId);
    List<Order> findByStatus(String status);
    Optional<Double> getTotalSpendingByUserId(Integer userId);
    List<Order> searchOrders(String role, String query, String status, String startDate, String endDate);
    List<OrderItem> findItemsByOrderId(Integer orderId);
}