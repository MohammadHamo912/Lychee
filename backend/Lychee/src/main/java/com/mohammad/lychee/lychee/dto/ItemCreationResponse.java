package com.mohammad.lychee.lychee.dto;

public class ItemCreationResponse {

    private boolean success;
    private String message;
    private Integer item_id;
    private Integer product_id;
    private Integer variant_id;
    private Integer category_id;

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

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
    }

    public Integer getProduct_id() {
        return product_id;
    }

    public void setProduct_id(Integer product_id) {
        this.product_id = product_id;
    }

    public Integer getVariant_id() {
        return variant_id;
    }

    public void setVariant_id(Integer variant_id) {
        this.variant_id = variant_id;
    }

    public Integer getCategory_id() {
        return category_id;
    }

    public void setCategory_id(Integer category_id) {
        this.category_id = category_id;
    }

    @Override
    public String toString() {
        return "ItemCreationResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", itemId=" + item_id +
                ", productId=" + product_id +
                ", variantId=" + variant_id +
                ", categoryId=" + category_id +
                '}';
    }
}