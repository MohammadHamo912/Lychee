package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ItemImage;
import java.util.List;
import java.util.Optional;

public interface ItemImageRepository {
    List<ItemImage> findAll();
    Optional<ItemImage> findById(Integer id);
    List<ItemImage> findByItemId(Integer itemId);
    ItemImage save(ItemImage itemImage);
    void delete(Integer id);
}