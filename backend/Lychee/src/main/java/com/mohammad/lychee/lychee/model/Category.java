package com.mohammad.lychee.lychee.model;

public class Category {
    private int category_id;
    private String name;
    private Integer parent_id;
    private int level;

    public Category() {}

    public Category(int category_id, String name, Integer parent_id, int level) {
        this.category_id = category_id;
        this.name = name;
        this.parent_id = parent_id;
        this.level = level;
    }

    // Getters and setters 👇

    public int getCategory_id() {
        return category_id;
    }

    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getParent_id() {
        return parent_id;
    }

    public void setParent_id(Integer parent_id) {
        this.parent_id = parent_id;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}