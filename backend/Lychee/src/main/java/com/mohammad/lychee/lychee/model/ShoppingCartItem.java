package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class ShoppingCartItem {
    private Integer user_id;
    private Integer item_id;
    private Integer quantity;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;

    // Default constructor
    public ShoppingCartItem() {}

    // Constructor with required fields
    public ShoppingCartItem(Integer user_id, Integer item_id, Integer quantity) {
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
    }

    // Full constructor
    public ShoppingCartItem(Integer user_id, Integer item_id, Integer quantity,
                            LocalDateTime created_at, LocalDateTime updated_at, LocalDateTime deleted_at) {
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
    }

    // Getters and Setters
    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    // Utility methods
    @Override
    public String toString() {
        return "ShoppingCartItem{" +
                "userId=" + user_id +
                ", itemId=" + item_id +
                ", quantity=" + quantity +
                ", createdAt=" + created_at +
                ", updatedAt=" + updated_at +
                ", deletedAt=" + deleted_at +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ShoppingCartItem that = (ShoppingCartItem) o;

        if (!user_id.equals(that.user_id)) return false;
        return item_id.equals(that.item_id);
    }

    @Override
    public int hashCode() {
        int result = user_id.hashCode();
        result = 31 * result + item_id.hashCode();
        return result;
    }
}