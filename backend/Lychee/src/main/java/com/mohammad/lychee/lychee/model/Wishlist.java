package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Wishlist {
    private int userId;
    private int productVariantId;
    private LocalDateTime addedAt;

    public Wishlist() {}

    public Wishlist(int userId, int productVariantId, LocalDateTime addedAt) {
        this.userId = userId;
        this.productVariantId = productVariantId;
        this.addedAt = addedAt;
    }

    // Getters and setters 👇

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(int productVariantId) {
        this.productVariantId = productVariantId;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}