package com.mohammad.lychee.lychee.model;

public class Category {
    private int categoryId;
    private String name;
    private Integer parentId;
    private int level;

    public Category() {}

    public Category(int categoryId, String name, Integer parentId, int level) {
        this.categoryId = categoryId;
        this.name = name;
        this.parentId = parentId;
        this.level = level;
    }

    // Getters and setters 👇

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}