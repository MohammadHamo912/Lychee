package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.WarehouseInventory;
import com.mohammad.lychee.lychee.repository.WarehouseInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class WarehouseInventoryRepositoryImpl implements WarehouseInventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public WarehouseInventoryRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<WarehouseInventory> rowMapper = (rs, rowNum) -> {
        WarehouseInventory wi = new WarehouseInventory();
        wi.setWarehouseInventoryId(rs.getInt("warehouse_inventory_id"));
        wi.setOrderItemId(rs.getInt("order_item_id"));
        wi.setStatus(rs.getString("status"));
        wi.setReceivedAt(rs.getTimestamp("received_at").toLocalDateTime());
        wi.setShippedAt(rs.getTimestamp("shipped_at").toLocalDateTime());
        return wi;
    };

    @Override
    public List<WarehouseInventory> findAll() {
        String sql = "SELECT * FROM WarehouseInventory";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Optional<WarehouseInventory> findById(Integer id) {
        try {
            String sql = "SELECT * FROM WarehouseInventory WHERE warehouse_inventory_id = ?";
            WarehouseInventory wi = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(wi);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<WarehouseInventory> findByOrderItemId(Integer orderItemId) {
        try {
            String sql = "SELECT * FROM WarehouseInventory WHERE order_item_id = ?";
            WarehouseInventory wi = jdbcTemplate.queryForObject(sql, rowMapper, orderItemId);
            return Optional.ofNullable(wi);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public WarehouseInventory save(WarehouseInventory wi) {
        String sql = "INSERT INTO WarehouseInventory (order_item_id, status, received_at, shipped_at) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                wi.getOrderItemId(),
                wi.getStatus(),
                wi.getReceivedAt(),
                wi.getShippedAt()
        );
        return wi; // assuming you manage auto-generation elsewhere
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM WarehouseInventory WHERE warehouse_inventory_id = ?";
        jdbcTemplate.update(sql, id);
    }
}
