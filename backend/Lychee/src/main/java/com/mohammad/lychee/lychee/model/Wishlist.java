package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Wishlist {
    private int userId;
    private int productVariantId;
    private LocalDateTime addedAt;

    // Optional frontend-friendly product data
    private String name;
    private String imageUrl;

    public Wishlist() {}

    public Wishlist(int userId, int productVariantId, LocalDateTime addedAt) {
        this.userId = userId;
        this.productVariantId = productVariantId;
        this.addedAt = addedAt;
    }

    // Getters and Setters
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
