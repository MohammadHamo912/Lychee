package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.User;
import com.mohammad.lychee.lychee.model.WarehouseInventory;
import com.mohammad.lychee.lychee.repository.WarehouseInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class WarehouseInventoryRepositoryImpl implements WarehouseInventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public WarehouseInventoryRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<WarehouseInventory> warehouseInventoryRowMapper = (rs, rowNum) -> {
        WarehouseInventory warehouseInventory = new WarehouseInventory();
        warehouseInventory.setWarehouseInventoryId(rs.getInt("warehouse_inventory_id"));
        warehouseInventory.setOrderItemId(rs.getInt("order_id")); // Note: using order_id from your schema
        warehouseInventory.setItemId(rs.getInt("item_id"));
        warehouseInventory.setStatus(rs.getString("status"));

        if (rs.getTimestamp("received_at") != null) {
            warehouseInventory.setReceivedAt(rs.getTimestamp("received_at").toLocalDateTime());
        }

        if (rs.getTimestamp("shipped_at") != null) {
            warehouseInventory.setShippedAt(rs.getTimestamp("shipped_at").toLocalDateTime());
        }

        return warehouseInventory;
    };

    @Override
    public List<WarehouseInventory> findAll() {
        String sql = "SELECT * FROM warehouseinverntory"; // Note: using your table name
        return jdbcTemplate.query(sql, warehouseInventoryRowMapper);
    }

    @Override
    public Optional<WarehouseInventory> findById(Integer id) {
        try {
            String sql = "SELECT * FROM warehouseinverntory WHERE warehouse_inventory_id = ?";
            WarehouseInventory warehouseInventory = jdbcTemplate.queryForObject(sql, warehouseInventoryRowMapper, id);
            return Optional.ofNullable(warehouseInventory);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<WarehouseInventory> findByOrderItemId(Integer orderItemId) {
        try {
            String sql = "SELECT * FROM warehouseinverntory WHERE order_id = ?";
            return Optional.ofNullable((WarehouseInventory) jdbcTemplate.query(sql, warehouseInventoryRowMapper, orderItemId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<WarehouseInventory> findByItemId(Integer itemId) {
        String sql = "SELECT * FROM warehouseinverntory WHERE item_id = ?";
        return jdbcTemplate.query(sql, warehouseInventoryRowMapper, itemId);
    }

    @Override
    public List<WarehouseInventory> findByStatus(String status) {
        String sql = "SELECT * FROM warehouseinverntory WHERE status = ?";
        return jdbcTemplate.query(sql, warehouseInventoryRowMapper, status);
    }

    @Override
    public WarehouseInventory save(WarehouseInventory warehouseInventory) {
        String sql = "INSERT INTO warehouseinverntory (order_id, item_id, status, received_at, shipped_at) " +
                "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, warehouseInventory.getOrderItemId());
            ps.setInt(2, warehouseInventory.getItemId());
            ps.setString(3, warehouseInventory.getStatus());

            if (warehouseInventory.getReceivedAt() != null) {
                ps.setTimestamp(4, java.sql.Timestamp.valueOf(warehouseInventory.getReceivedAt()));
            } else {
                ps.setNull(4, java.sql.Types.TIMESTAMP);
            }

            if (warehouseInventory.getShippedAt() != null) {
                ps.setTimestamp(5, java.sql.Timestamp.valueOf(warehouseInventory.getShippedAt()));
            } else {
                ps.setNull(5, java.sql.Types.TIMESTAMP);
            }

            return ps;
        }, keyHolder);

        warehouseInventory.setWarehouseInventoryId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return warehouseInventory;
    }

    @Override
    public void update(WarehouseInventory warehouseInventory) {
        String sql = "UPDATE warehouseinverntory SET order_id = ?, item_id = ?, status = ?, " +
                "received_at = ?, shipped_at = ? WHERE warehouse_inventory_id = ?";

        jdbcTemplate.update(sql,
                warehouseInventory.getOrderItemId(),
                warehouseInventory.getItemId(),
                warehouseInventory.getStatus(),
                warehouseInventory.getReceivedAt() != null ?
                        java.sql.Timestamp.valueOf(warehouseInventory.getReceivedAt()) : null,
                warehouseInventory.getShippedAt() != null ?
                        java.sql.Timestamp.valueOf(warehouseInventory.getShippedAt()) : null,
                warehouseInventory.getWarehouseInventoryId()
        );
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM warehouseinverntory WHERE warehouse_inventory_id = ?";
        jdbcTemplate.update(sql, id);
    }
}