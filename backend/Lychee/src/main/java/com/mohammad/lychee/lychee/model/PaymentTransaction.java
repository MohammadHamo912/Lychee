package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentTransaction {
    private int paymentTransactionId;
    private int orderId;
    private BigDecimal amount;
    private String status;
    private String transactionReference;
    private LocalDateTime createdAt;

    public PaymentTransaction() {}

    public PaymentTransaction(int paymentTransactionId, int orderId,
                              BigDecimal amount, String status, String transactionReference,
                              LocalDateTime createdAt) {
        this.paymentTransactionId = paymentTransactionId;
        this.orderId = orderId;
        this.amount = amount;
        this.status = status;
        this.transactionReference = transactionReference;
        this.createdAt = createdAt;
    }

    // Getters and setters

    public int getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public void setPaymentTransactionId(int paymentTransactionId) {
        this.paymentTransactionId = paymentTransactionId;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}