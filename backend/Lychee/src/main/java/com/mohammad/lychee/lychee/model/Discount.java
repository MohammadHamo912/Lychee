package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Discount {
    private int discountId;
    private BigDecimal discountPercentage;
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;

    // Default constructor
    public Discount() {}

    // Constructor with all fields
    public Discount(int discountId, BigDecimal discountPercentage, String code,
                    LocalDate startDate, LocalDate endDate, boolean active) {
        this.discountId = discountId;
        this.discountPercentage = discountPercentage;
        this.code = code;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    // Constructor without ID (for creating new discounts)
    public Discount(BigDecimal discountPercentage, String code,
                    LocalDate startDate, LocalDate endDate, boolean active) {
        this.discountPercentage = discountPercentage;
        this.code = code;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    // Getters and setters
    public int getDiscountId() {
        return discountId;
    }

    public void setDiscountId(int discountId) {
        this.discountId = discountId;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    // Helper method to check if discount is currently valid
    public boolean isCurrentlyValid() {
        LocalDate now = LocalDate.now();
        return active &&
                (startDate == null || !now.isBefore(startDate)) &&
                (endDate == null || !now.isAfter(endDate));
    }

    @Override
    public String toString() {
        return "Discount{" +
                "discountId=" + discountId +
                ", discountPercentage=" + discountPercentage +
                ", code='" + code + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", active=" + active +
                '}';
    }
}