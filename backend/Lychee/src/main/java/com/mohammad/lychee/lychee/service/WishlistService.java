package com.mohammad.lychee.lychee.service;


import com.mohammad.lychee.lychee.model.Wishlist;
import java.util.List;
import java.util.Optional;

public interface WishlistService {
    List<Wishlist> getWishlistItemsByUserId(Integer userId);
    boolean isItemInWishlist(Integer userId, Integer productVariantId);
    void addItemToWishlist(Wishlist wishlistItem);
    void removeItemFromWishlist(Integer userId, Integer productVariantId);
    void clearWishlist(Integer userId);
}