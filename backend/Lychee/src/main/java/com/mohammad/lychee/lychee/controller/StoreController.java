package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for your React app
public class StoreController {
    @Autowired
    private StoreService storeService;

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
            store.setStore_id(storeId);
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
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Store> getStoreByOwnerId(@PathVariable Integer ownerId) {
        List<Store> stores = storeService.getStoresByShopOwnerId(ownerId);
        if (stores.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(stores.get(0)); // Assuming 1 store per owner
    }
    @GetMapping("/{storeId}/metrics")
    public ResponseEntity<Map<String, Object>> getStoreMetrics(@PathVariable int storeId) {
        return storeService.getStoreMetrics(storeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    @GetMapping("/{storeId}/sales")
    public ResponseEntity<List<Map<String, Object>>> getSalesChartData(
            @PathVariable int storeId,
            @RequestParam(defaultValue = "7days") String period
    ) {
        return ResponseEntity.ok(storeService.getSalesChartData(storeId, period));
    }
    @GetMapping("/{storeId}/reviews")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByStoreId(@PathVariable int storeId) {
        try {
            List<Map<String, Object>> reviews = storeService.getReviewsByStoreId(storeId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("Failed to fetch store reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
