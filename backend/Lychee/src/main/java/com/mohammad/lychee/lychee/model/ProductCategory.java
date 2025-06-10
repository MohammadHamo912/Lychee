package com.mohammad.lychee.lychee.model;

public class ProductCategory {
    private int product_id;
    private int category_id;

    public ProductCategory() {}

    public ProductCategory(int product_id, int category_id) {
        this.product_id = product_id;
        this.category_id = category_id;
    }

    // Getters and setters

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }
}