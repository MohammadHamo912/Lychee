package com.mohammad.lychee.lychee.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentTransaction {
    private int payment_transaction_id;
    private int order_id;
    private BigDecimal amount;
    private String status;
    private String transaction_reference;
    private LocalDateTime created_at;

    public PaymentTransaction() {}

    public PaymentTransaction(int payment_transaction_id, int order_id,
                              BigDecimal amount, String status, String transaction_reference,
                              LocalDateTime created_at) {
        this.payment_transaction_id = payment_transaction_id;
        this.order_id = order_id;
        this.amount = amount;
        this.status = status;
        this.transaction_reference = transaction_reference;
        this.created_at = created_at;
    }

    // Getters and setters

    public int getPayment_transaction_id() {
        return payment_transaction_id;
    }

    public void setPayment_transaction_id(int payment_transaction_id) {
        this.payment_transaction_id = payment_transaction_id;
    }

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
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

    public String getTransaction_reference() {
        return transaction_reference;
    }

    public void setTransaction_reference(String transaction_reference) {
        this.transaction_reference = transaction_reference;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
}