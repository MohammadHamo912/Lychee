package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.repository.OrderItemRepository;
import com.mohammad.lychee.lychee.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderItemServiceImpl(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    @Override
    public Optional<OrderItem> getOrderItem(Integer orderId, Integer itemId) {
        return orderItemRepository.findByOrderIdAndItemId(orderId, itemId);
    }

    @Override
    @Transactional
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @Override
    @Transactional
    public OrderItem updateOrderItem(OrderItem orderItem) {
        Optional<OrderItem> existing = orderItemRepository.findByOrderIdAndItemId(
                orderItem.getOrder_id(), orderItem.getItem_id());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("order_item with order ID " + orderItem.getOrder_id() +
                    " and Item ID " + orderItem.getItem_id() + " not found");
        }
        return orderItemRepository.save(orderItem);
    }

    @Override
    @Transactional
    public void deleteOrderItem(Integer orderId, Integer itemId) {
        orderItemRepository.softDelete(orderId, itemId);
    }

    @Override
    public List<OrderItem> getOrderItemsByStoreId(Integer storeId) {
        return orderItemRepository.getOrderItemsByStoreId(storeId);
    }
}
