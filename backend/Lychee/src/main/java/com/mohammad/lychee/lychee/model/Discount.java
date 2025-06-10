package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Discount {
    private int discount_id;
    private BigDecimal discount_percentage;
    private String code;
    private LocalDate start_date;
    private LocalDate end_date;
    private boolean active;

    // Default constructor
    public Discount() {}

    // Constructor with all fields
    public Discount(int discount_id, BigDecimal discount_percentage, String code,
                    LocalDate start_date, LocalDate end_date, boolean active) {
        this.discount_id = discount_id;
        this.discount_percentage = discount_percentage;
        this.code = code;
        this.start_date = start_date;
        this.end_date = end_date;
        this.active = active;
    }

    // Constructor without ID (for creating new discounts)
    public Discount(BigDecimal discount_percentage, String code,
                    LocalDate start_date, LocalDate end_date, boolean active) {
        this.discount_percentage = discount_percentage;
        this.code = code;
        this.start_date = start_date;
        this.end_date = end_date;
        this.active = active;
    }

    // Getters and setters
    public int getDiscount_id() {
        return discount_id;
    }

    public void setDiscount_id(int discount_id) {
        this.discount_id = discount_id;
    }

    public BigDecimal getDiscount_percentage() {
        return discount_percentage;
    }

    public void setDiscount_percentage(BigDecimal discount_percentage) {
        this.discount_percentage = discount_percentage;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDate getStart_date() {
        return start_date;
    }

    public void setStart_date(LocalDate start_date) {
        this.start_date = start_date;
    }

    public LocalDate getEnd_date() {
        return end_date;
    }

    public void setEnd_date(LocalDate end_date) {
        this.end_date = end_date;
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
                (start_date == null || !now.isBefore(start_date)) &&
                (end_date == null || !now.isAfter(end_date));
    }

    @Override
    public String toString() {
        return "Discount{" +
                "discount_id=" + discount_id +
                ", discount_percentage=" + discount_percentage +
                ", code='" + code + '\'' +
                ", startDate=" + start_date +
                ", endDate=" + end_date +
                ", active=" + active +
                '}';
    }
}