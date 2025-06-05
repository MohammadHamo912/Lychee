package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Store;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StoreRepository {
    List<Store> findAll();
    Optional<Store> findById(Integer id);
    List<Store> findByShopOwnerId(Integer shopOwnerId);

    List<Store> findByNameContaining(String name);
    Store save(Store store);
    void delete(Integer id);
    void softDelete(Integer id);
    public Optional<Map<String, Object>> getStoreMetrics(int storeId);
    List<Map<String, Object>> getSalesChartData(int storeId, String period);
    List<Map<String, Object>> getReviewsByStoreId(int storeId);
}