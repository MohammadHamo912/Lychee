package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Product {
    private int productId;
    private String barcode;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

<<<<<<< HEAD
    public Product() {}

    public Product(int productId, String barcode, String name, String description,
                   LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
=======
    private String logo_url;

    public Product() {}

    public Product(int productId, String barcode, String name, String description,
                   LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt,String logo_url) {
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
        this.productId = productId;
        this.barcode = barcode;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
<<<<<<< HEAD
    }

    // Getters and setters 👇
=======
        this.logo_url = logo_url;
    }

    // Getters and setters
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
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
<<<<<<< HEAD
=======
    public String getLogo_url() {
        return logo_url;
    }

    public void setLogo_url(String logo_url) {
        this.logo_url = logo_url;
    }

>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
}