package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Wishlist;
import com.mohammad.lychee.lychee.repository.WishlistRepository;
import com.mohammad.lychee.lychee.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    @Autowired
    public WishlistServiceImpl(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @Override
    public List<Wishlist> getWishlistItemsByUserId(Integer userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    public boolean isItemInWishlist(Integer userId, Integer productVariantId) {
        Optional<Wishlist> wishlistItem = wishlistRepository.findByUserIdAndItemId(userId, productVariantId);
        return wishlistItem.isPresent();
    }

    @Override
    @Transactional
    public void addItemToWishlist(Wishlist wishlistItem) {
        // Check if item already in wishlist
        if (!isItemInWishlist(wishlistItem.getUser_id(), wishlistItem.getItem_id())) {
            wishlistRepository.addWishlistItem(wishlistItem.getUser_id(), wishlistItem.getItem_id());
        }
        // If already in wishlist, do nothing (idempotent operation)
    }


    @Override
    @Transactional
    public void removeItemFromWishlist(Integer userId, Integer productVariantId) {
        wishlistRepository.removeWishlistItem(userId, productVariantId);
    }

    @Override
    @Transactional
    public void clearWishlist(Integer userId) {
        wishlistRepository.deleteAllByUserId(userId);
    }
}