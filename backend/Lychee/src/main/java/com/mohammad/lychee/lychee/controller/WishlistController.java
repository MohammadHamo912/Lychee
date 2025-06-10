package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Wishlist;
import com.mohammad.lychee.lychee.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Integer userId) {
        List<Wishlist> items = wishlistService.getWishlistItemsByUserId(userId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addWishlistItem(@RequestParam Integer userId,
                                                @RequestParam Integer itemId) {
        Wishlist item = new Wishlist();
        item.setUser_id(userId);
        item.setItem_id(itemId);
        wishlistService.addItemToWishlist(item);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeWishlistItem(@RequestParam Integer userId,
                                                   @RequestParam Integer itemId) {
        wishlistService.removeItemFromWishlist(userId, itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearWishlist(@PathVariable Integer userId) {
        wishlistService.clearWishlist(userId);
        return ResponseEntity.ok().build();
    }
}
