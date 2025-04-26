package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.WarehouseInventory;
import com.mohammad.lychee.lychee.repository.WarehouseInventoryRepository;
import com.mohammad.lychee.lychee.service.WarehouseInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseInventoryServiceImpl implements WarehouseInventoryService {

    private final WarehouseInventoryRepository warehouseInventoryRepository;

    @Autowired
    public WarehouseInventoryServiceImpl(WarehouseInventoryRepository warehouseInventoryRepository) {
        this.warehouseInventoryRepository = warehouseInventoryRepository;
    }

    @Override
    public List<WarehouseInventory> getAllWarehouseInventories() {
        return warehouseInventoryRepository.findAll();
    }

    @Override
    public Optional<WarehouseInventory> getWarehouseInventoryById(Integer warehouseInventoryId) {
        return warehouseInventoryRepository.findById(warehouseInventoryId);
    }

    @Override
    public Optional<WarehouseInventory> getByOrderItemId(Integer orderItemId) {
        return warehouseInventoryRepository.findByOrderItemId(orderItemId);
    }

    @Override
    @Transactional
    public WarehouseInventory createWarehouseInventory(WarehouseInventory warehouseInventory) {
        return warehouseInventoryRepository.save(warehouseInventory);
    }

    @Override
    @Transactional
    public WarehouseInventory updateWarehouseInventory(WarehouseInventory warehouseInventory) {
        Optional<WarehouseInventory> existing = warehouseInventoryRepository.findById(warehouseInventory.getWarehouseInventoryId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("WarehouseInventory with ID " + warehouseInventory.getWarehouseInventoryId() + " not found");
        }
        return warehouseInventoryRepository.save(warehouseInventory);
    }

    @Override
    @Transactional
    public void deleteWarehouseInventory(Integer warehouseInventoryId) {
        warehouseInventoryRepository.delete(warehouseInventoryId);
    }
}
