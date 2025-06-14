package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Order;
import java.util.List;
import java.util.Optional;
import java.util.Map;

public interface OrderRepository {
    List<Order> findAll();
    Optional<Order> findById(Integer orderId);
    List<Order> findByUserId(Integer userId);
    Order save(Order order);
    void update(Order order);
    void softDelete(Integer orderId);
    List<Order> findByStatus(String status);
    Optional<Double> getTotalSpendingByUserId(Integer userId);
    List<Order> searchOrders(String role, String query, String status, String startDate, String endDate, Integer userId, Integer storeId);

    List<Map<String, Object>> getOrderItemSummaries(int orderId);

    /**
     * Update order status
     */
    void updateOrderStatus(Integer orderId, String status);
    List<Map<String, Object>> getOrderItemDetailsByStoreAndOrderId(Integer storeId, Integer orderId);

}