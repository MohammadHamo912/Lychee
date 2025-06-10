package com.mohammad.lychee.lychee.dto;

import java.math.BigDecimal;


public class CartEnrichedItem extends EnrichedItem {
    private Integer cart_quantity;

    // Constructors
    public CartEnrichedItem() {
        super();
    }

    public CartEnrichedItem(EnrichedItem enrichedItem, Integer cart_quantity) {
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
        this.setCurrent_variant(enrichedItem.getCurrent_variant());
        this.setAvailable_variants(enrichedItem.getAvailable_variants());
        this.setStore_name(enrichedItem.getStore_name());
        this.setFinal_price(enrichedItem.getFinal_price());
        this.setStock(enrichedItem.getStock());

        // Set the cart-specific field
        this.cart_quantity = cart_quantity;
    }

    // Cart quantity getter and setter
    public Integer getCart_quantity() {
        return cart_quantity;
    }

    public void setCart_quantity(Integer cart_quantity) {
        this.cart_quantity = cart_quantity;
    }

    // Helper method to calculate total price for this cart item
    public BigDecimal getCartItemTotal() {
        if (getFinal_price() != null && cart_quantity != null) {
            return getFinal_price().multiply(BigDecimal.valueOf(cart_quantity));
        }
        return BigDecimal.ZERO;
    }
}