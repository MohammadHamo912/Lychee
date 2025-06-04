package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.OrderItem;
import java.util.List;
import java.util.Optional;

public interface OrderItemService {
    List<OrderItem> getAllOrderItems();
    List<OrderItem> getOrderItemsByOrderId(Integer orderId);
    Optional<OrderItem> getOrderItem(Integer orderId, Integer itemId);
    OrderItem createOrderItem(OrderItem orderItem);
    OrderItem updateOrderItem(OrderItem orderItem);
    void deleteOrderItem(Integer orderId, Integer itemId);

    List<OrderItem> getOrderItemsByStoreId(Integer storeId);

}
