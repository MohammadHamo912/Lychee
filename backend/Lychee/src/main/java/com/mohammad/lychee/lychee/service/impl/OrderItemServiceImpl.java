package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.OrderItem;
import com.mohammad.lychee.lychee.repository.OrderItemRepository;
import com.mohammad.lychee.lychee.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderItemServiceImpl(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderId(Integer orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    @Override
    public List<OrderItem> getOrderItemsByStoreId(Integer storeId) {
        return orderItemRepository.findByStoreId(storeId);
    }

    @Override
    public void saveOrderItem(OrderItem item) {
        if (item.getCreatedAt() == null) {
            item.setCreatedAt(LocalDateTime.now());
        }
        if (item.getUpdatedAt() == null) {
            item.setUpdatedAt(LocalDateTime.now());
        }
        orderItemRepository.save(item);
    }

    @Override
    public void updateOrderItem(OrderItem item) {
        item.setUpdatedAt(LocalDateTime.now());
        orderItemRepository.update(item);
    }

    @Override
    public void deleteOrderItemById(Integer id) {
        orderItemRepository.deleteById(id);
    }

    @Override
    public void deleteOrderItemsByOrderId(Integer orderId) {
        orderItemRepository.deleteByOrderId(orderId);
    }
}
