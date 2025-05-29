package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Item;
import com.mohammad.lychee.lychee.repository.ItemRepository;
import com.mohammad.lychee.lychee.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    @Autowired
    public ItemServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public Optional<Item> getItemById(Integer itemId) {
        return itemRepository.findById(itemId);
    }

    @Override
    public List<Item> getItemsByStoreId(Integer storeId) {
        return itemRepository.findByStoreId(storeId);
    }

    @Override
    public List<Item> getItemsByProductVariantId(Integer productVariantId) {
        return itemRepository.findByProductVariantId(productVariantId);
    }

    @Override
    @Transactional
    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    @Transactional
    public Item updateItem(Item item) {
        Optional<Item> existingItem = itemRepository.findById(item.getItemId());
        if (existingItem.isEmpty()) {
            throw new IllegalArgumentException("Item with ID " + item.getItemId() + " does not exist");
        }

        itemRepository.save(item);
        return item;
    }

    @Override
    @Transactional
    public void softDeleteItem(Integer itemId) {
        itemRepository.softDelete(itemId);
    }

    @Override
    @Transactional
    public void updateStock(Integer itemId, Integer newQuantity) {
        Optional<Item> itemOptional = itemRepository.findById(itemId);
        if (itemOptional.isEmpty()) {
            throw new IllegalArgumentException("Item with ID " + itemId + " does not exist");
        }

        Item item = itemOptional.get();
        item.setStockQuantity(newQuantity);
        itemRepository.save(item);
    }

    @Override
    @Transactional
    public void updatePrice(Integer itemId, BigDecimal newPrice) {
        Optional<Item> itemOptional = itemRepository.findById(itemId);
        if (itemOptional.isEmpty()) {
            throw new IllegalArgumentException("Item with ID " + itemId + " does not exist");
        }

        Item item = itemOptional.get();
        item.setPrice(newPrice);
        itemRepository.save(item);
    }

    @Override
    @Transactional
    public void updateDiscount(Integer itemId, BigDecimal discount) {
        Optional<Item> itemOptional = itemRepository.findById(itemId);
        if (itemOptional.isEmpty()) {
            throw new IllegalArgumentException("Item with ID " + itemId + " does not exist");
        }

        Item item = itemOptional.get();
        item.setDiscount(discount);
        itemRepository.save(item);
    }

    @Override
    public Optional<Item> searchItemsByProductName(String productName) {
        return itemRepository.findByName(productName);
    }

    @Override
    public List<Item> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return itemRepository.findByPriceBetween(minPrice, maxPrice);
    }


}