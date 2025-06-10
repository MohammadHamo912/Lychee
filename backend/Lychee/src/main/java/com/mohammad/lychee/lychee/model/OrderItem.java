package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderItem {
    private int order_id;
    private int item_id;
    private String shipping_status;
    private int quantity;
    private BigDecimal price_at_purchase;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;

    public OrderItem() {}

    public OrderItem(int order_id, int item_id, String shipping_status, int quantity,
                     BigDecimal price_at_purchase, LocalDateTime created_at,
                     LocalDateTime updated_at, LocalDateTime deleted_at) {
        this.order_id = order_id;
        this.item_id = item_id;
        this.shipping_status = shipping_status;
        this.quantity = quantity;
        this.price_at_purchase = price_at_purchase;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
    }

    // Getters and setters 👇

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public int getItem_id() {
        return item_id;
    }

    public void setItem_id(int item_id) {
        this.item_id = item_id;
    }

    public String getShipping_status() {
        return shipping_status;
    }

    public void setShipping_status(String shipping_status) {
        this.shipping_status = shipping_status;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice_at_purchase() {
        return price_at_purchase;
    }

    public void setPrice_at_purchase(BigDecimal price_at_purchase) {
        this.price_at_purchase = price_at_purchase;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public LocalDateTime getDeleted_at() {
        return deleted_at;
    }

    public void setDeleted_at(LocalDateTime deleted_at) {
        this.deleted_at = deleted_at;
    }
}