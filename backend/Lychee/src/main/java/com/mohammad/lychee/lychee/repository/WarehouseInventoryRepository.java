package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.WarehouseInventory;
import java.util.List;
import java.util.Optional;

public interface WarehouseInventoryRepository {
    List<WarehouseInventory> findAll();
    Optional<WarehouseInventory> findById(Integer warehouseInventoryId);
    Optional<WarehouseInventory> findByOrderItemId(Integer orderItemId); // Special
    WarehouseInventory save(WarehouseInventory warehouseInventory);
    void delete(Integer warehouseInventoryId);
}
