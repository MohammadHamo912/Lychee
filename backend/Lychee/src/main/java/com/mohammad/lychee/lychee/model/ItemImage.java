package com.mohammad.lychee.lychee.model;

public class ItemImage {
    private int imageId;
    private int itemId;
    private String imageUrl;
    private String caption;

    public ItemImage() {}

    public ItemImage(int imageId, int itemId, String imageUrl, String caption) {
        this.imageId = imageId;
        this.itemId = itemId;
        this.imageUrl = imageUrl;
        this.caption = caption;
    }

    // Getters and setters

    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }
}