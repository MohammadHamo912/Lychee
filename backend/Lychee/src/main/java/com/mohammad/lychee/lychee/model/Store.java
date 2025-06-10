package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Store {
    private int store_id;
    private int shopowner_id;
    private int address_id;
    private String name;
    private String description;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;
    private String logo_url;

    public Store() {}

    public Store(int store_id, int shopowner_id, int address_id, String name, String description,
                 LocalDateTime created_at, LocalDateTime updated_at, LocalDateTime deleted_at, String logo_url) {
        this.store_id = store_id;
        this.shopowner_id = shopowner_id;
        this.address_id = address_id;
        this.name = name;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.deleted_at = deleted_at;
        this.logo_url = logo_url;
    }

    // Getters and setters

    public int getStore_id() {
        return store_id;
    }

    public void setStore_id(int store_id) {
        this.store_id = store_id;
    }

    public int getShopowner_id() {
        return shopowner_id;
    }

    public void setShopowner_id(int shopowner_id) {
        this.shopowner_id = shopowner_id;
    }

    public int getAddress_id() {
        return address_id;
    }

    public void setAddress_id(int address_id) {
        this.address_id = address_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
    public String getLogo_url() {
        return logo_url;
    }

    public void setLogo_url(String logo_url) {
        this.logo_url = logo_url;
    }

}