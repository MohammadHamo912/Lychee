package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    List<Order> getOrdersByUserId(Integer userId);
    Optional<Order> getOrderById(Integer orderId);
    Order createOrder(Order order);
    Order updateOrder(Order order);
    void deleteOrder(Integer orderId);
    List<Order> searchOrders(String role, String query, String status, String startDate, String endDate, Integer userId, Integer storeId);

}
