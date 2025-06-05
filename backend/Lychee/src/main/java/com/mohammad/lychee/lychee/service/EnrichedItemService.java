package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.dto.EnrichedItem;
import java.util.List;
import java.util.Optional;

public interface EnrichedItemService {
    List<EnrichedItem> getAllEnrichedItems();
    Optional<EnrichedItem> getEnrichedItemById(Integer itemId);
    List<EnrichedItem> getEnrichedItemsByStoreId(Integer storeId);
    List<EnrichedItem> getEnrichedTrendingItems();
    List<EnrichedItem> searchEnrichedItems(String query);
    List<EnrichedItem> searchEnrichedItemsInStore(Integer storeId, String query);
    List<EnrichedItem> getEnrichedItemsByIds(List<Integer> itemIds);
}