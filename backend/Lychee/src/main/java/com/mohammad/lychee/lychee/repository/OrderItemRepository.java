package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.OrderItem;
import java.util.List;
import java.util.Optional;

public interface OrderItemRepository {
    List<OrderItem> findAll();
    Optional<OrderItem> findById(Integer orderId, Integer itemId);
    List<OrderItem> findByOrderId(Integer orderId);
    OrderItem save(OrderItem orderItem);
    void update(OrderItem orderItem);
    void softDelete(Integer orderId, Integer itemId);
    List<OrderItem> findByItemId(Integer itemId);
    List<OrderItem> findByShippingStatus(String shippingStatus);
    Optional<OrderItem> findByOrderIdAndItemId(Integer orderId, Integer itemId);

    List<OrderItem> getOrderItemsByStoreId(Integer storeId);
}