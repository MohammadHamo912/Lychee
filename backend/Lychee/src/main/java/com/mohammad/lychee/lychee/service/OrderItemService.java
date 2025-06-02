package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.OrderItem;

import java.util.List;

public interface OrderItemService {

    List<OrderItem> getOrderItemsByOrderId(Integer orderId);

    List<OrderItem> getOrderItemsByStoreId(Integer storeId);

    void saveOrderItem(OrderItem item);

    void deleteOrderItemById(Integer id);

    void deleteOrderItemsByOrderId(Integer orderId);
    void updateOrderItem(OrderItem item);
}