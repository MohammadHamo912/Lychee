package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Wishlist;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository {
    List<Wishlist> findAll();
    List<Wishlist> findByUserId(Integer userId);
    void addWishlistItem(Integer userId, Integer productVariantId);
    void removeWishlistItem(Integer userId, Integer productVariantId);
    Optional<Wishlist> findByUserIdAndProductVariantId(Integer userId, Integer productVariantId);
    void deleteAllByUserId(Integer userId);
}
