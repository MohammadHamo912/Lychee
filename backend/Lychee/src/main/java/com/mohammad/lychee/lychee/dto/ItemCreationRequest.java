package com.mohammad.lychee.lychee.dto;

import java.math.BigDecimal;

public class ItemCreationRequest {

    // Store information
    private Integer store_id;

    // Product information
    private String product_name;
    private String description;
    private String barcode;
    private String brand;
    private String image_url;

    // Category information
    private Integer category_id; // Use existing category
    private String new_category_name; // Create new category
    private Integer parent_category_id; // Required if creating new category

    // Variant information
    private String size;
    private String color;

    // Item information
    private BigDecimal price;
    private Integer stock_quantity;
    private BigDecimal discount;

    // Constructors
    public ItemCreationRequest() {}

    // Getters and Setters
    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public Integer getCategory_id() {
        return category_id;
    }

    public void setCategory_id(Integer category_id) {
        this.category_id = category_id;
    }

    public String getNew_category_name() {
        return new_category_name;
    }

    public void setNew_category_name(String new_category_name) {
        this.new_category_name = new_category_name;
    }

    public Integer getParent_category_id() {
        return parent_category_id;
    }

    public void setParent_category_id(Integer parent_category_id) {
        this.parent_category_id = parent_category_id;
    }

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
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock_quantity() {
        return stock_quantity;
    }

    public void setStock_quantity(Integer stock_quantity) {
        this.stock_quantity = stock_quantity;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    @Override
    public String toString() {
        return "ItemCreationRequest{" +
                "storeId=" + store_id +
                ", productName='" + product_name + '\'' +
                ", description='" + description + '\'' +
                ", barcode='" + barcode + '\'' +
                ", brand='" + brand + '\'' +
                ", imageUrl='" + image_url + '\'' +
                ", categoryId=" + category_id +
                ", newCategoryName='" + new_category_name + '\'' +
                ", parentCategoryId=" + parent_category_id +
                ", size='" + size + '\'' +
                ", color='" + color + '\'' +
                ", price=" + price +
                ", stock_quantity=" + stock_quantity +
                ", discount=" + discount +
                '}';
    }
}