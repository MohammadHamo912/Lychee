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
        this.setItem_id(enrichedItem.getItem_id());
        this.setStore_id(enrichedItem.getStore_id());
        this.setProduct_variant_id(enrichedItem.getProduct_variant_id());
        this.setPrice(enrichedItem.getPrice());
        this.setDiscount(enrichedItem.getDiscount());
        this.setStock_quantity(enrichedItem.getStock_quantity());
        this.setCreated_at(enrichedItem.getCreated_at());
        this.setUpdated_at(enrichedItem.getUpdated_at());
        this.setDeleted_at(enrichedItem.getDeleted_at());
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