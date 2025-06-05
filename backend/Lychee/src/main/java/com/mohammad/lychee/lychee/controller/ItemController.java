package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Item;
import com.mohammad.lychee.lychee.dto.EnrichedItem;
import com.mohammad.lychee.lychee.service.ItemService;
import com.mohammad.lychee.lychee.service.EnrichedItemService;
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

    @Autowired
    private EnrichedItemService enrichedItemService;

    // ========== ENRICHED ENDPOINTS ==========

    @GetMapping("/enriched")
    public ResponseEntity<List<EnrichedItem>> getAllEnrichedItems() {
            List<EnrichedItem> enrichedItems = enrichedItemService.getAllEnrichedItems();
            return ResponseEntity.ok(enrichedItems);

    }

    @GetMapping("/enriched/{itemId:[0-9]+}")
    public ResponseEntity<EnrichedItem> getEnrichedItemById(@PathVariable Integer itemId) {
        try {
            Optional<EnrichedItem> enrichedItem = enrichedItemService.getEnrichedItemById(itemId);
            return enrichedItem.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error getting enriched item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/enriched/store/{storeId:[0-9]+}")
    public ResponseEntity<List<EnrichedItem>> getEnrichedItemsByStoreId(@PathVariable Integer storeId) {
        try {
            List<EnrichedItem> enrichedItems = enrichedItemService.getEnrichedItemsByStoreId(storeId);
            return ResponseEntity.ok(enrichedItems);
        } catch (Exception e) {
            System.err.println("Error getting enriched items by store: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/enriched/trending")
    public ResponseEntity<List<EnrichedItem>> getEnrichedTrendingItems() {
        try {
            List<EnrichedItem> enrichedItems = enrichedItemService.getEnrichedTrendingItems();
            return ResponseEntity.ok(enrichedItems);
        } catch (Exception e) {
            System.err.println("Error getting enriched trending items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/enriched/search")
    public ResponseEntity<List<EnrichedItem>> searchEnrichedItems(@RequestParam String query) {
        try {
            List<EnrichedItem> enrichedItems = enrichedItemService.searchEnrichedItems(query);
            return ResponseEntity.ok(enrichedItems);
        } catch (Exception e) {
            System.err.println("Error searching enriched items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/enriched/store/{storeId}/search")
    public ResponseEntity<List<EnrichedItem>> searchEnrichedItemsInStore(
            @PathVariable Integer storeId,
            @RequestParam String query) {
        try {
            List<EnrichedItem> enrichedItems = enrichedItemService.searchEnrichedItemsInStore(storeId, query);
            return ResponseEntity.ok(enrichedItems);
        } catch (Exception e) {
            System.err.println("Error searching enriched items in store: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/enriched/by-ids")
    public ResponseEntity<List<EnrichedItem>> getEnrichedItemsByIds(@RequestBody List<Integer> itemIds) {
        try {
            List<EnrichedItem> enrichedItems = enrichedItemService.getEnrichedItemsByIds(itemIds);
            return ResponseEntity.ok(enrichedItems);
        } catch (Exception e) {
            System.err.println("Error getting enriched items by IDs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== ORIGINAL ENDPOINTS (keep for backward compatibility) ==========

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
        return itemService.getItemsByStoreIdAndName(storeId, query);
    }


}