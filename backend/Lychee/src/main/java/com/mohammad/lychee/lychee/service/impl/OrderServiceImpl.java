package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Order;
import com.mohammad.lychee.lychee.repository.OrderRepository;
import com.mohammad.lychee.lychee.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Optional<Order> getOrderById(Integer orderId) {
        return orderRepository.findById(orderId);
    }

    @Override
    @Transactional
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrder(Order order) {
        Optional<Order> existing = orderRepository.findById(order.getOrder_id());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Order with ID " + order.getOrder_id() + " not found");
        }
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Integer orderId) {
        orderRepository.softDelete(orderId);
    }
    @Override
    public List<Order> searchOrders(String role, String query, String status, String startDate, String endDate, Integer userId, Integer storeId) {
        return orderRepository.searchOrders(role, query, status, startDate, endDate, userId, storeId);
    }

    @Override
    public List<Map<String, Object>> getOrderItemSummaries(int orderId) {
        return orderRepository.getOrderItemSummaries(orderId);
    }
    @Override
    public void updateOrderStatus(int orderId, String newStatus) {
        orderRepository.updateOrderStatus(orderId, newStatus);
    }
    @Override
    public List<Map<String, Object>> getOrderItemDetailsByStoreAndOrderId(Integer storeId, Integer orderId) {
        return orderRepository.getOrderItemDetailsByStoreAndOrderId(storeId, orderId);
    }

}
