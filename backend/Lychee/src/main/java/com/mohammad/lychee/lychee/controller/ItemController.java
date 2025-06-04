package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Item;
import com.mohammad.lychee.lychee.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }



    @GetMapping("/{itemId:[0-9]+}")
    public ResponseEntity<Item> getItemById(@PathVariable Integer itemId) {
        Optional<Item> item = itemService.getItemById(itemId);
        return item.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/store/{storeId:[0-9]+}")
    public List<Item> getItemsByStoreId(@PathVariable Integer storeId) {
        return itemService.getItemsByStoreId(storeId);
    }

    @GetMapping("/variant/{productVariantId:[0-9]+}")
    public List<Item> getItemsByProductVariantId(@PathVariable Integer productVariantId) {
        return itemService.getItemsByProductVariantId(productVariantId);
    }
    @GetMapping("/trending")
    public List<Item> getTrendingItems() {
        return itemService.getTrendingItems();
    }

    @PostMapping("/by-ids")
    public List<Item> getItemsByIds(@RequestBody List<Integer> itemIds) {
        return itemService.getItemsByIds(itemIds);
    }

    @GetMapping("/price-range")
    public List<Item> getItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return itemService.getItemsByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/search")
    public ResponseEntity<Item> searchItemsByProductName(@RequestParam String productName) {
        Optional<Item> item = itemService.searchItemsByProductName(productName);
        return item.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        try {
            Item createdItem = itemService.createItem(item);
            return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{itemId:[0-9]+}")
    public ResponseEntity<Item> updateItem(@PathVariable Integer itemId, @RequestBody Item item) {
        try {
            item.setItemId(itemId);
            Item updatedItem = itemService.updateItem(item);
            return ResponseEntity.ok(updatedItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{itemId:[0-9]+}/stock")
    public ResponseEntity<Void> updateStock(
            @PathVariable Integer itemId,
            @RequestParam Integer quantity) {
        try {
            itemService.updateStock(itemId, quantity);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{itemId:[0-9]+}/price")
    public ResponseEntity<Void> updatePrice(
            @PathVariable Integer itemId,
            @RequestParam BigDecimal price) {
        try {
            itemService.updatePrice(itemId, price);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{itemId:[0-9]+}/discount")
    public ResponseEntity<Void> updateDiscount(
            @PathVariable Integer itemId,
            @RequestParam BigDecimal discount) {
        try {
            itemService.updateDiscount(itemId, discount);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{itemId:[0-9]+}")
    public ResponseEntity<Void> softDeleteItem(@PathVariable Integer itemId) {
        try {
            itemService.softDeleteItem(itemId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/store/{storeId}/search")
    public List<Item> searchItemsByNameInStore(
            @PathVariable Integer storeId,
            @RequestParam String query
    ) {
        return itemService.getItemsByStoreIdAndName(storeId,query);
    }

}