package com.mohammad.lychee.lychee.model;

public class ItemImage {
    private int image_id;
    private int item_id;
    private String image_url;
    private String caption;

    public ItemImage() {}

    public ItemImage(int image_id, int item_id, String image_url, String caption) {
        this.image_id = image_id;
        this.item_id = item_id;
        this.image_url = image_url;
        this.caption = caption;
    }

    // Getters and setters

    public int getImage_id() {
        return image_id;
    }

    public void setImage_id(int image_id) {
        this.image_id = image_id;
    }

    public int getItem_id() {
        return item_id;
    }

    public void setItem_id(int item_id) {
        this.item_id = item_id;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }
}