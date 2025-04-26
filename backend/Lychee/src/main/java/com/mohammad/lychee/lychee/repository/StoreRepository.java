package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Store;
import java.util.List;
import java.util.Optional;

public interface StoreRepository {
    List<Store> findAll();
    Optional<Store> findById(Integer id);
    List<Store> findByShopOwnerId(Integer shopOwnerId);
    Store save(Store store);
    void delete(Integer id);
    void softDelete(Integer id);
}