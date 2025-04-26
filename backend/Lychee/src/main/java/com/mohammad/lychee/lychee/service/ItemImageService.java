package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.ItemImage;
import java.util.List;
import java.util.Optional;

public interface ItemImageService {
    List<ItemImage> getAllItemImages();
    Optional<ItemImage> getItemImageById(Integer imageId);
    List<ItemImage> getItemImagesByItemId(Integer itemId);
    ItemImage createItemImage(ItemImage itemImage);
    ItemImage updateItemImage(ItemImage itemImage);
    void deleteItemImage(Integer imageId);
}