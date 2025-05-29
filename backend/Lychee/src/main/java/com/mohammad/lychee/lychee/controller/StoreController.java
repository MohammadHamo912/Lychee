package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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


}
