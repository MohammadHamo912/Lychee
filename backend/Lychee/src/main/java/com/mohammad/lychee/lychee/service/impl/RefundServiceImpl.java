package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Refund;
import com.mohammad.lychee.lychee.repository.RefundRepository;
import com.mohammad.lychee.lychee.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RefundServiceImpl implements RefundService {

    private final RefundRepository refundRepository;

    @Autowired
    public RefundServiceImpl(RefundRepository refundRepository) {
        this.refundRepository = refundRepository;
    }

    @Override
    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }

    @Override
    public Optional<Refund> getRefundById(Integer refundId) {
        return refundRepository.findById(refundId);
    }

    @Override
    public Optional<Refund> getRefundByTransactionId(Integer transactionId) {
        return refundRepository.findByTransactionId(transactionId);
    }

    @Override
    @Transactional
    public Refund createRefund(Refund refund) {
        return refundRepository.save(refund);
    }

    @Override
    @Transactional
    public Refund updateRefund(Refund refund) {
        Optional<Refund> existing = refundRepository.findById(refund.getRefundId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Refund with ID " + refund.getRefundId() + " not found");
        }
        return refundRepository.save(refund);
    }

    @Override
    @Transactional
    public void deleteRefund(Integer refundId) {
        refundRepository.delete(refundId);
    }
}
