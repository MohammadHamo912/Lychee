package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderItem {
    private int orderId;
    private int itemId;
    private String shippingStatus;
    private int quantity;
    private BigDecimal priceAtPurchase;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public OrderItem() {}

    public OrderItem(int orderId, int itemId, String shippingStatus, int quantity,
                     BigDecimal priceAtPurchase, LocalDateTime createdAt,
                     LocalDateTime updatedAt, LocalDateTime deletedAt) {
        this.orderId = orderId;
        this.itemId = itemId;
        this.shippingStatus = shippingStatus;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    // Getters and setters 👇

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getShippingStatus() {
        return shippingStatus;
    }

    public void setShippingStatus(String shippingStatus) {
        this.shippingStatus = shippingStatus;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}