package com.mohammad.lychee.lychee.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class EnrichedItem {
    // Item fields
    private Integer itemId;
    private Integer id; // Alias for itemId for frontend compatibility
    private Integer storeId;
    private Integer productVariantId;
    private BigDecimal price;
    private BigDecimal discount;
    private Integer stockQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    // Product fields (enriched)
    private String name;
    private String description;
    private String brand;
    private String barcode;
    private String image; // logo_url from product

    // Current variant info
    private CurrentVariant currentVariant;

    // Available variants for this product
    private List<AvailableVariant> availableVariants;

    // Store info
    private String storeName;

    // Calculated fields
    private BigDecimal finalPrice; // price after discount
    private Integer stock; // alias for stockQuantity

    // Default constructor
    public EnrichedItem() {}

    // Getters and Setters
    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
        this.id = itemId; // Set alias
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStoreId() {
        return storeId;
    }

    public void setStoreId(Integer storeId) {
        this.storeId = storeId;
    }

    public Integer getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Integer productVariantId) {
        this.productVariantId = productVariantId;
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

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
        this.stock = stockQuantity; // Set alias
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

    public CurrentVariant getCurrentVariant() {
        return currentVariant;
    }

    public void setCurrentVariant(CurrentVariant currentVariant) {
        this.currentVariant = currentVariant;
    }

    public List<AvailableVariant> getAvailableVariants() {
        return availableVariants;
    }

    public void setAvailableVariants(List<AvailableVariant> availableVariants) {
        this.availableVariants = availableVariants;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    // Helper method to calculate final price
    private void calculateFinalPrice() {
        if (price != null && discount != null) {
            BigDecimal discountAmount = price.multiply(discount).divide(BigDecimal.valueOf(100));
            this.finalPrice = price.subtract(discountAmount);
        } else if (price != null) {
            this.finalPrice = price;
        }
    }

    // Nested classes for structured data
    public static class CurrentVariant {
        private Integer id;
        private Integer productId;
        private String size;
        private String color;

        // Constructors
        public CurrentVariant() {}

        public CurrentVariant(Integer id, Integer productId, String size, String color) {
            this.id = id;
            this.productId = productId;
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

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
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
        private Integer productId;
        private String size;
        private String color;
        private Boolean available;
        private Boolean availableInSameStore;

        // Constructors
        public AvailableVariant() {}

        public AvailableVariant(Integer id, Integer productId, String size, String color,
                                Boolean available, Boolean availableInSameStore) {
            this.id = id;
            this.productId = productId;
            this.size = size;
            this.color = color;
            this.available = available;
            this.availableInSameStore = availableInSameStore;
        }

        // Getters and Setters
        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
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

        public Boolean getAvailableInSameStore() {
            return availableInSameStore;
        }

        public void setAvailableInSameStore(Boolean availableInSameStore) {
            this.availableInSameStore = availableInSameStore;
        }
    }
}