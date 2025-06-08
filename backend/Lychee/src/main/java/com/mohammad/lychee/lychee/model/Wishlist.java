package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Wishlist {
    private int userId;
    private int itemId;
    private LocalDateTime addedAt;

    // Added fields from Item table:
    private String name;
    private String imageUrl;
    private double price;

    public Wishlist() {}

    public Wishlist(int userId, int itemId, LocalDateTime addedAt) {
        this.userId = userId;
        this.itemId = itemId;
        this.addedAt = addedAt;
    }

    // ==== Getters and Setters ====

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
