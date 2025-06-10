package com.mohammad.lychee.lychee.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class EnrichedItem {
    // Item fields
    private Integer item_id;
    private Integer id; // Alias for itemId for frontend compatibility
    private Integer store_id;
    private Integer product_variant_id;
    private BigDecimal price;
    private BigDecimal discount;
    private Integer stock_quantity;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime deleted_at;

    // Product fields (enriched)
    private String name;
    private String description;
    private String brand;
    private String barcode;
    private String image; // logo_url from product

    // Current variant info
    private CurrentVariant current_variant;

    // Available variants for this product
    private List<AvailableVariant> available_variants;

    // Store info
    private String store_name;

    // Calculated fields
    private BigDecimal final_price; // price after discount
    private Integer stock; // alias for stock_quantity

    // Default constructor
    public EnrichedItem() {}

    // ==== Getters and Setters ====

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
        this.id = item_id; // Set alias
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
    }

    public Integer getProduct_variant_id() {
        return product_variant_id;
    }

    public void setProduct_variant_id(Integer product_variant_id) {
        this.product_variant_id = product_variant_id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        calculateFinalPrice();
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
        calculateFinalPrice();
    }

    public Integer getStock_quantity() {
        return stock_quantity;
    }

    public void setStock_quantity(Integer stock_quantity) {
        this.stock_quantity = stock_quantity;
        this.stock = stock_quantity; // Set alias
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

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public CurrentVariant getCurrent_variant() {
        return current_variant;
    }

    public void setCurrent_variant(CurrentVariant current_variant) {
        this.current_variant = current_variant;
    }

    public List<AvailableVariant> getAvailable_variants() {
        return available_variants;
    }

    public void setAvailable_variants(List<AvailableVariant> available_variants) {
        this.available_variants = available_variants;
    }

    public String getStore_name() {
        return store_name;
    }

    public void setStore_name(String store_name) {
        this.store_name = store_name;
    }

    public BigDecimal getFinal_price() {
        return final_price;
    }

    public void setFinal_price(BigDecimal final_price) {
        this.final_price = final_price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    // Helper method to calculate final price (price after discount)
    private void calculateFinalPrice() {
        if (price != null && discount != null) {
            BigDecimal discountAmount = price.multiply(discount).divide(BigDecimal.valueOf(100));
            this.final_price = price.subtract(discountAmount);
        } else if (price != null) {
            this.final_price = price;
        }
    }

    // === Nested classes ===

    public static class CurrentVariant {
        private Integer id;
        private Integer product_id;
        private String size;
        private String color;

        public CurrentVariant() {}

        public CurrentVariant(Integer id, Integer product_id, String size, String color) {
            this.id = id;
            this.product_id = product_id;
            this.size = size;
            this.color = color;
        }

        // Getters and Setters
        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getProduct_id() {
            return product_id;
        }

        public void setProduct_id(Integer product_id) {
            this.product_id = product_id;
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
    }

    public static class AvailableVariant {
        private Integer id;
        private Integer producd_id;
        private String size;
        private String color;
        private Boolean available;              // availability flag (optional)
        private Boolean available_in_same_store;  // availability in same store (optional)

        public AvailableVariant() {}

        public AvailableVariant(Integer id, Integer producd_id, String size, String color,
                                Boolean available, Boolean available_in_same_store) {
            this.id = id;
            this.producd_id = producd_id;
            this.size = size;
            this.color = color;
            this.available = available;
            this.available_in_same_store = available_in_same_store;
        }

        // Getters and Setters
        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getProducd_id() {
            return producd_id;
        }

        public void setProducd_id(Integer producd_id) {
            this.producd_id = producd_id;
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

        public Boolean getAvailable() {
            return available;
        }

        public void setAvailable(Boolean available) {
            this.available = available;
        }

        public Boolean getAvailable_in_same_store() {
            return available_in_same_store;
        }

        public void setAvailable_in_same_store(Boolean available_in_same_store) {
            this.available_in_same_store = available_in_same_store;
        }
    }
}
