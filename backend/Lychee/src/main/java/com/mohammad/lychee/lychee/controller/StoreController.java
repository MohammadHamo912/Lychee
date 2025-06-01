package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for your React app
public class StoreController {
    @Autowired
    private StoreService storeService;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Store> getAppStores(){
        return storeService.getAllStores();
    }

    @GetMapping("/{storeId}") 
    public ResponseEntity<Store> getStoreById(@PathVariable Integer storeId){
        Optional<Store> store = storeService.getStoreById(storeId);
        return store.map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Store> createStore(@RequestBody Store store){
        try {
            Store createdStore = storeService.createStore(store);
            return new ResponseEntity<>(createdStore, HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping("/{storeId}")
    public ResponseEntity<Store> updateStore(@PathVariable Integer storeId, @RequestBody Store store){
        try{
            store.setStoreId(storeId);
            Store updatedStore = storeService.updateStore(store);
            return ResponseEntity.ok(updatedStore);
        }catch (IllegalArgumentException e){
            return ResponseEntity.notFound().build();
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{storeId}")
    public ResponseEntity<Void> softDeleteStore(@PathVariable Integer storeId){
        try{
            storeService.softDeleteStore(storeId);
            return ResponseEntity.noContent().build();
        }catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{storeId}/metrics")
    public ResponseEntity<Map<String, Object>> getStoreMetrics(@PathVariable Integer storeId) {
        Map<String, Object> metrics = storeService.getStoreMetrics(storeId);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/{storeId}/reviews")
    public ResponseEntity<List<Map<String, Object>>> getStoreReviews(@PathVariable Integer storeId) {
        return ResponseEntity.ok(storeService.getStoreReviewsAsMap(storeId));
    }

    @GetMapping("/{storeId}/sales")
    public ResponseEntity<List<Map<String, Object>>> getSalesData(
            @PathVariable Integer storeId,
            @RequestParam String timeframe) {
        return ResponseEntity.ok(storeService.getSalesData(storeId, timeframe));
    }
    @GetMapping("/shopowner/{shopOwnerId}")
    public ResponseEntity<Map<String, Object>> getStoreByShopOwnerId(@PathVariable Integer shopOwnerId) {
        List<Store> stores = storeService.getStoresByShopOwnerId(shopOwnerId);
        if (stores.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Store store = stores.get(0);

        Map<String, Object> storeMap = new HashMap<>();
        storeMap.put("storeId", store.getStoreId());
        storeMap.put("name", store.getName());
        storeMap.put("description", store.getDescription());
        storeMap.put("logoUrl", store.getLogo_url());

        // 👇 Fetch address details
        Map<String, Object> addressMap = new HashMap<>();
        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(
                    "SELECT city, street, building FROM Address WHERE Address_ID = ?",
                    store.getAddressId()
            );
            addressMap.put("city", row.get("city"));
            addressMap.put("street", row.get("street"));
            addressMap.put("building", row.get("building"));
        } catch (Exception e) {
            // Fallback if address not found
            addressMap.put("city", "");
            addressMap.put("street", "");
            addressMap.put("building", "");
        }

        storeMap.put("address", addressMap);

        return ResponseEntity.ok(storeMap);
    }


}
