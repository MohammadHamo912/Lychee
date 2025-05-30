package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Wishlist;
import com.mohammad.lychee.lychee.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    private final WishlistRepository wishlistRepository;

    @Autowired
    public WishlistController(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Integer userId) {
        return ResponseEntity.ok(wishlistRepository.findByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addWishlistItem(@RequestParam Integer userId,
                                                @RequestParam Integer productVariantId) {
        wishlistRepository.addWishlistItem(userId, productVariantId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeWishlistItem(@RequestParam Integer userId,
                                                   @RequestParam Integer productVariantId) {
        wishlistRepository.removeWishlistItem(userId, productVariantId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearWishlist(@PathVariable Integer userId) {
        wishlistRepository.deleteAllByUserId(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Wishlist API is working.");
    }
}
