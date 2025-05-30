package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.repository.StoreRepository;
import com.mohammad.lychee.lychee.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;

    @Autowired
    public StoreServiceImpl(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @Override
    public Optional<Store> getStoreById(Integer storeId) {
        return storeRepository.findById(storeId);
    }

    @Override
    public List<Store> getStoresByShopOwnerId(Integer shopOwnerId) {
        return storeRepository.findByShopOwnerId(shopOwnerId);
    }

    @Override
    @Transactional
    public Store createStore(Store store) {
        return storeRepository.save(store);
    }

    @Override
    @Transactional
    public Store updateStore(Store store) {
        Optional<Store> existingStore = storeRepository.findById(store.getStoreId());
        if (existingStore.isEmpty()) {
            throw new IllegalArgumentException("Store with ID " + store.getStoreId() + " does not exist");
        }

        storeRepository.save(store);
        return store;
    }

    @Override
    @Transactional
    public void softDeleteStore(Integer storeId) {
        storeRepository.softDelete(storeId);
    }

    @Override
    public List<Store> searchStoresByName(String name) {
        return storeRepository.findByNameContaining(name);
    }
}