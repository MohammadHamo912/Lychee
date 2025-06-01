package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Store;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StoreService {
    List<Store> getAllStores();
    Optional<Store> getStoreById(Integer storeId);
    List<Store> getStoresByShopOwnerId(Integer shopOwnerId);
    Store createStore(Store store);
    Store updateStore(Store store);
    void softDeleteStore(Integer storeId);
    List<Store> searchStoresByName(String name);
    Map<String, Object> getStoreMetrics(Integer storeId);
    List<Map<String, Object>> getStoreReviewsAsMap(Integer storeId);
    List<Map<String, Object>> getSalesData(Integer storeId, String timeframe);

}