package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class WarehouseInventory {
    private int warehouseInventoryId;
    private int orderId;
    private int itemId;
    private String status;
    private LocalDateTime receivedAt;
    private LocalDateTime shippedAt;

    public WarehouseInventory() {}

    public WarehouseInventory(int warehouseInventoryId, int orderId, int itemId, String status,
                              LocalDateTime receivedAt, LocalDateTime shippedAt) {
        this.warehouseInventoryId = warehouseInventoryId;
        this.orderId = orderId;
        this.itemId = itemId;
        this.status = status;
        this.receivedAt = receivedAt;
        this.shippedAt = shippedAt;
    }

    // Getters and setters 👇

    public int getWarehouseInventoryId() {
        return warehouseInventoryId;
    }

    public void setWarehouseInventoryId(int warehouseInventoryId) {
        this.warehouseInventoryId = warehouseInventoryId;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(LocalDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    public LocalDateTime getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(LocalDateTime shippedAt) {
        this.shippedAt = shippedAt;
    }
}