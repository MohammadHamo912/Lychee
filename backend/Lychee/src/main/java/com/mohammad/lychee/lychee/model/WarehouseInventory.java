package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class WarehouseInventory {
    private int warehouseInventoryId;
    private int orderItemId;
    private int itemId;
    private String status;
    private LocalDateTime receivedAt;
    private LocalDateTime shippedAt;

    public WarehouseInventory() {}

    public WarehouseInventory(int warehouseInventoryId, int orderId, int itemId, String status,
                              LocalDateTime receivedAt, LocalDateTime shippedAt) {
        this.warehouseInventoryId = warehouseInventoryId;
        this.orderItemId = orderItemId;
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

    public int getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(int orderItemId) {
        this.orderItemId = orderItemId;
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