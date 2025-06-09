package com.mohammad.lychee.lychee.dto;

public class ItemCreationResponse {

    private boolean success;
    private String message;
    private Integer itemId;
    private Integer productId;
    private Integer variantId;
    private Integer categoryId;

    // Constructors
    public ItemCreationResponse() {}

    public ItemCreationResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getVariantId() {
        return variantId;
    }

    public void setVariantId(Integer variantId) {
        this.variantId = variantId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public String toString() {
        return "ItemCreationResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", itemId=" + itemId +
                ", productId=" + productId +
                ", variantId=" + variantId +
                ", categoryId=" + categoryId +
                '}';
    }
}