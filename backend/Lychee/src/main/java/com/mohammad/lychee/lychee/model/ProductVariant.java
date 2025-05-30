package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class ProductVariant {
    private int productVariantId;
    private int productId;
<<<<<<< HEAD
    private String variantType;
    private String variantValue;
=======
    private String size;
    private String color;
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public ProductVariant() {}

<<<<<<< HEAD
    public ProductVariant(int productVariantId, int productId, String variantType, String variantValue,
                          LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
        this.productVariantId = productVariantId;
        this.productId = productId;
        this.variantType = variantType;
        this.variantValue = variantValue;
=======
    public ProductVariant(int productVariantId, int productId, String size, String color,
                          LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
        this.productVariantId = productVariantId;
        this.productId = productId;
        this.size = size;
        this.color = color;
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

<<<<<<< HEAD
    // Getters and setters 👇
=======
    // Getters and setters
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad

    public int getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(int productVariantId) {
        this.productVariantId = productVariantId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

<<<<<<< HEAD
    public String getVariantType() {
        return variantType;
    }

    public void setVariantType(String variantType) {
        this.variantType = variantType;
    }

    public String getVariantValue() {
        return variantValue;
    }

    public void setVariantValue(String variantValue) {
        this.variantValue = variantValue;
=======
    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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
}