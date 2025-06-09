package com.mohammad.lychee.lychee.dto;

import java.math.BigDecimal;


public class CartEnrichedItem extends EnrichedItem {
    private Integer cartQuantity;

    // Constructors
    public CartEnrichedItem() {
        super();
    }

    public CartEnrichedItem(EnrichedItem enrichedItem, Integer cartQuantity) {
        super();
        // Copy all fields from EnrichedItem
        this.setItemId(enrichedItem.getItemId());
        this.setStoreId(enrichedItem.getStoreId());
        this.setProductVariantId(enrichedItem.getProductVariantId());
        this.setPrice(enrichedItem.getPrice());
        this.setDiscount(enrichedItem.getDiscount());
        this.setStockQuantity(enrichedItem.getStockQuantity());
        this.setCreatedAt(enrichedItem.getCreatedAt());
        this.setUpdatedAt(enrichedItem.getUpdatedAt());
        this.setDeletedAt(enrichedItem.getDeletedAt());
        this.setName(enrichedItem.getName());
        this.setDescription(enrichedItem.getDescription());
        this.setBrand(enrichedItem.getBrand());
        this.setBarcode(enrichedItem.getBarcode());
        this.setImage(enrichedItem.getImage());
        this.setCurrentVariant(enrichedItem.getCurrentVariant());
        this.setAvailableVariants(enrichedItem.getAvailableVariants());
        this.setStoreName(enrichedItem.getStoreName());
        this.setFinalPrice(enrichedItem.getFinalPrice());
        this.setStock(enrichedItem.getStock());

        // Set the cart-specific field
        this.cartQuantity = cartQuantity;
    }

    // Cart quantity getter and setter
    public Integer getCartQuantity() {
        return cartQuantity;
    }

    public void setCartQuantity(Integer cartQuantity) {
        this.cartQuantity = cartQuantity;
    }

    // Helper method to calculate total price for this cart item
    public BigDecimal getCartItemTotal() {
        if (getFinalPrice() != null && cartQuantity != null) {
            return getFinalPrice().multiply(BigDecimal.valueOf(cartQuantity));
        }
        return BigDecimal.ZERO;
    }
}