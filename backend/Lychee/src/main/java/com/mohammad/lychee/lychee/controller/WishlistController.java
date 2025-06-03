package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Wishlist;
import com.mohammad.lychee.lychee.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000") // adjust as needed for prod
public class WishlistController {

    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // ✅ Get all wishlist items for a specific user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Integer userId) {
        List<Wishlist> items = wishlistService.getWishlistItemsByUserId(userId);
        return ResponseEntity.ok(items);
    }

    // ✅ Add an item to wishlist if not already present
    @PostMapping("/add")
    public ResponseEntity<Void> addWishlistItem(@RequestParam Integer userId,
                                                @RequestParam Integer productVariantId) {
        Wishlist item = new Wishlist();
        item.setUserId(userId);
        item.setProductVariantId(productVariantId);
        wishlistService.addItemToWishlist(item);
        return ResponseEntity.ok().build();
    }

    // ✅ Remove one item from wishlist
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeWishlistItem(@RequestParam Integer userId,
                                                   @RequestParam Integer productVariantId) {
        wishlistService.removeItemFromWishlist(userId, productVariantId);
        return ResponseEntity.ok().build();
    }

    // ✅ Clear entire wishlist
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearWishlist(@PathVariable Integer userId) {
        wishlistService.clearWishlist(userId);
        return ResponseEntity.ok().build();
    }

    // ✅ Optional test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Wishlist API is working.");
    }
}
