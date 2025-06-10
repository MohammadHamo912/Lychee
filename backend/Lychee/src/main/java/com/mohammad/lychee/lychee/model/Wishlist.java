package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Wishlist {
    private int user_id;
    private int item_id;
    private LocalDateTime added_at;

    // Added fields from Item table:
    private String name;
    private String image_url;
    private double price;

    public Wishlist() {}

    public Wishlist(int user_id, int item_id, LocalDateTime added_at) {
        this.user_id = user_id;
        this.item_id = item_id;
        this.added_at = added_at;
    }

    // ==== Getters and Setters ====

    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public int getItem_id() { return item_id; }
    public void setItem_id(int item_id) { this.item_id = item_id; }

    public LocalDateTime getAdded_at() { return added_at; }
    public void setAdded_at(LocalDateTime added_at) { this.added_at = added_at; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage_url() { return image_url; }
    public void setImage_url(String image_url) { this.image_url = image_url; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
