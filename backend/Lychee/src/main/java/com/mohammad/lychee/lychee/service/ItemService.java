package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Item;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ItemService {

    List<Item> getAllItems();

    Optional<Item> getItemById(Integer itemId);

    List<Item> getItemsByStoreId(Integer storeId);

    List<Item> getItemsByProductVariantId(Integer productVariantId);

    // NEW METHODS
    List<Item> getTrendingItems();

    List<Item> getItemsByIds(List<Integer> itemIds);

    Item createItem(Item item);

    Item updateItem(Item item);

    void softDeleteItem(Integer itemId);

    void updateStock(Integer itemId, Integer newQuantity);

    void updatePrice(Integer itemId, BigDecimal newPrice);

    void updateDiscount(Integer itemId, BigDecimal discount);

    Optional<Item> searchItemsByProductName(String productName);

    List<Item> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
}