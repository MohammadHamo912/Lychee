package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.WarehouseInventory;
import java.util.List;
import java.util.Optional;

public interface WarehouseInventoryRepository {
    List<WarehouseInventory> findAll();
    Optional<WarehouseInventory> findById(Integer id);
    Optional<WarehouseInventory> findByOrderItemId(Integer orderItemId);
    List<WarehouseInventory> findByItemId(Integer itemId);
    List<WarehouseInventory> findByStatus(String status);
    WarehouseInventory save(WarehouseInventory warehouseInventory);
    void update(WarehouseInventory warehouseInventory);
    void delete(Integer id);
}