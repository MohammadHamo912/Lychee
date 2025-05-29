package com.mohammad.lychee.lychee.model;

public class ProductFeature {
    private int featureId;
    private int productId;
    private String description;

    public ProductFeature() {}

    public ProductFeature(int featureId, int productId, String description) {
        this.featureId = featureId;
        this.productId = productId;
        this.description = description;
    }

    // Getters and setters 👇

    public int getFeatureId() {
        return featureId;
    }

    public void setFeatureId(int featureId) {
        this.featureId = featureId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}