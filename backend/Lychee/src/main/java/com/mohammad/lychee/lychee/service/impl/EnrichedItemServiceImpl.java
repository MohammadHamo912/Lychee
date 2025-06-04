package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.dto.EnrichedItem;
import com.mohammad.lychee.lychee.service.EnrichedItemService;
import com.mohammad.lychee.lychee.repository.EnrichedItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrichedItemServiceImpl implements EnrichedItemService {

    @Autowired
    private EnrichedItemRepository enrichedItemRepository;

    @Override
    public List<EnrichedItem> getAllEnrichedItems() {
        try {
            System.out.println("EnrichedItemService - Getting all enriched items");
            List<EnrichedItem> items = enrichedItemRepository.findAllEnriched();
            System.out.println("EnrichedItemService - Found " + items.size() + " enriched items");
            return items;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error getting all enriched items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Optional<EnrichedItem> getEnrichedItemById(Integer itemId) {
        try {
            System.out.println("EnrichedItemService - Getting enriched item by ID: " + itemId);
            Optional<EnrichedItem> item = enrichedItemRepository.findEnrichedById(itemId);
            System.out.println("EnrichedItemService - Found item: " + item.isPresent());
            return item;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error getting enriched item by ID: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> getEnrichedItemsByStoreId(Integer storeId) {
        try {
            System.out.println("EnrichedItemService - Getting enriched items by store ID: " + storeId);
            List<EnrichedItem> items = enrichedItemRepository.findEnrichedByStoreId(storeId);
            System.out.println("EnrichedItemService - Found " + items.size() + " items for store " + storeId);
            return items;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error getting enriched items by store: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> getEnrichedTrendingItems() {
        try {
            System.out.println("EnrichedItemService - Getting enriched trending items");
            List<EnrichedItem> items = enrichedItemRepository.findEnrichedTrending();
            System.out.println("EnrichedItemService - Found " + items.size() + " trending items");
            return items;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error getting enriched trending items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> searchEnrichedItems(String query) {
        try {
            System.out.println("EnrichedItemService - Searching enriched items with query: " + query);
            List<EnrichedItem> items = enrichedItemRepository.searchEnriched(query);
            System.out.println("EnrichedItemService - Found " + items.size() + " items for query: " + query);
            return items;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error searching enriched items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> searchEnrichedItemsInStore(Integer storeId, String query) {
        try {
            System.out.println("EnrichedItemService - Searching enriched items in store " + storeId + " with query: " + query);
            List<EnrichedItem> items = enrichedItemRepository.searchEnrichedInStore(storeId, query);
            System.out.println("EnrichedItemService - Found " + items.size() + " items");
            return items;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error searching enriched items in store: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> getEnrichedItemsByIds(List<Integer> itemIds) {
        try {
            System.out.println("EnrichedItemService - Getting enriched items by IDs: " + itemIds);
            List<EnrichedItem> items = enrichedItemRepository.findEnrichedByIds(itemIds);
            System.out.println("EnrichedItemService - Found " + items.size() + " items");
            return items;
        } catch (Exception e) {
            System.err.println("EnrichedItemService - Error getting enriched items by IDs: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}