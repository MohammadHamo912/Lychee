package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.ItemImage;
import com.mohammad.lychee.lychee.repository.ItemImageRepository;
import com.mohammad.lychee.lychee.service.ItemImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ItemImageServiceImpl implements ItemImageService {

    private final ItemImageRepository itemImageRepository;

    @Autowired
    public ItemImageServiceImpl(ItemImageRepository itemImageRepository) {
        this.itemImageRepository = itemImageRepository;
    }

    @Override
    public List<ItemImage> getAllItemImages() {
        return itemImageRepository.findAll();
    }

    @Override
    public Optional<ItemImage> getItemImageById(Integer imageId) {
        return itemImageRepository.findById(imageId);
    }

    @Override
    public List<ItemImage> getItemImagesByItemId(Integer itemId) {
        return itemImageRepository.findByItemId(itemId);
    }

    @Override
    @Transactional
    public ItemImage createItemImage(ItemImage itemImage) {
        return itemImageRepository.save(itemImage);
    }

    @Override
    @Transactional
    public ItemImage updateItemImage(ItemImage itemImage) {
        Optional<ItemImage> existingImage = itemImageRepository.findById(itemImage.getImageId());
        if (existingImage.isEmpty()) {
            throw new IllegalArgumentException("Item image with ID " + itemImage.getImageId() + " does not exist");
        }

        itemImageRepository.save(itemImage);
        return itemImage;
    }

    @Override
    @Transactional
    public void deleteItemImage(Integer imageId) {
        itemImageRepository.delete(imageId);
    }
}