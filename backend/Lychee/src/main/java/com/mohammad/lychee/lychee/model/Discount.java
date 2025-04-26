package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Discount {
    private int discountId;
    private String discountType;
    private BigDecimal discountValue;
    private LocalDate expirationDate;

    public Discount() {}

    public Discount(int discountId, String discountType, BigDecimal discountValue, LocalDate expirationDate) {
        this.discountId = discountId;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.expirationDate = expirationDate;
    }

    // Getters and setters 👇

    public int getDiscountId() {
        return discountId;
    }

    public void setDiscountId(int discountId) {
        this.discountId = discountId;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
}