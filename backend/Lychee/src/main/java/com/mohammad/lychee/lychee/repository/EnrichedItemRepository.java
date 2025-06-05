package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.dto.EnrichedItem;
import java.util.List;
import java.util.Optional;

public interface EnrichedItemRepository {
    List<EnrichedItem> findAllEnriched();
    Optional<EnrichedItem> findEnrichedById(Integer itemId);
    List<EnrichedItem> findEnrichedByStoreId(Integer storeId);
    List<EnrichedItem> findEnrichedTrending();
    List<EnrichedItem> searchEnriched(String query);
    List<EnrichedItem> searchEnrichedInStore(Integer storeId, String query);
    List<EnrichedItem> findEnrichedByIds(List<Integer> itemIds);
}