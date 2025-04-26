package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Item;
import java.util.List;
import java.util.Optional;

public interface ItemRepository {
    List<Item> findAll();
    Optional<Item> findById(Integer id);
    List<Item> findByStoreId(Integer storeId);
    List<Item> findByProductVariantId(Integer productVariantId);
    Item save(Item item);
    void delete(Integer id);
    void softDelete(Integer id);
    List<Item> findByProductId(Integer productId);
}