package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.WarehouseInventory;
import java.util.List;
import java.util.Optional;

public interface WarehouseInventoryService {
    List<WarehouseInventory> getAllWarehouseInventories();
    Optional<WarehouseInventory> getWarehouseInventoryById(Integer warehouseInventoryId);
    Optional<WarehouseInventory> getByOrderItemId(Integer orderItemId);
    WarehouseInventory createWarehouseInventory(WarehouseInventory warehouseInventory);
    WarehouseInventory updateWarehouseInventory(WarehouseInventory warehouseInventory);
    void deleteWarehouseInventory(Integer warehouseInventoryId);
}
