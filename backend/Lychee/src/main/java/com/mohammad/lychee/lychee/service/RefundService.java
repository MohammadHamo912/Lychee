package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Refund;
import java.util.List;
import java.util.Optional;

public interface RefundService {
    List<Refund> getAllRefunds();
    Optional<Refund> getRefundById(Integer refundId);
    Optional<Refund> getRefundByTransactionId(Integer transactionId);
    Refund createRefund(Refund refund);
    Refund updateRefund(Refund refund);
    void deleteRefund(Integer refundId);
}
