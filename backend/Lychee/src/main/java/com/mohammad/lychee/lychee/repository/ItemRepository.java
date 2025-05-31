package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Item;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ItemRepository {
    List<Item> findAll();
    Optional<Item> findById(Integer id);
    Optional<Item> findByName(String name);
    List<Item> findByStoreId(Integer storeId);
    List<Item> findByProductVariantId(Integer productVariantId);
    List<Item> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Item> findTrendingItems();
    List<Item> findByItemIdIn(List<Integer> itemIds);
    List<Item> findActiveItems();
    Item save(Item item);
    void delete(Integer id);
    void softDelete(Integer id);
    List<Item> findByProductId(Integer productId);
}