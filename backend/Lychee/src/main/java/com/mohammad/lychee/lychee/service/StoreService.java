package com.mohammad.lychee.lychee.service;

import java.util.Map;
import com.mohammad.lychee.lychee.model.Store;
import java.util.List;
import java.util.Optional;

public interface StoreService {
    List<Store> getAllStores();
    Optional<Store> getStoreById(Integer storeId);
    List<Store> getStoresByShopOwnerId(Integer shopOwnerId);
    Store createStore(Store store);
    Store updateStore(Store store);
    void softDeleteStore(Integer storeId);
    List<Store> searchStoresByName(String name);
    Optional<Map<String, Object>> getStoreMetrics(int storeId);
    List<Map<String, Object>> getSalesChartData(int storeId, String period);
    List<Map<String, Object>> getReviewsByStoreId(int storeId);
}