package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class StoreRepositoryImpl implements StoreRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public StoreRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Store> storeRowMapper = (rs, rowNum) -> {
        Store store = new Store();
        store.setStoreId(rs.getInt("Store_ID"));
        store.setShopOwnerId(rs.getInt("ShopOwner_ID"));
        store.setAddressId(rs.getInt("Address_ID"));
        store.setName(rs.getString("name"));
        store.setDescription(rs.getString("description"));
        store.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        store.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);
        store.setDeletedAt(rs.getTimestamp("deleted_at") != null ?
                rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        store.setLogo_url(rs.getString("logo_url") != null ?
                rs.getString("logo_url") : null );
        return store;
    };

    @Override
    public List<Store> findAll() {
        String sql = "SELECT * FROM Store WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, storeRowMapper);
    }

    @Override
    public Optional<Store> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Store WHERE Store_ID = ? AND deleted_at IS NULL";
            Store store = jdbcTemplate.queryForObject(sql, storeRowMapper, id);
            return Optional.ofNullable(store);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Store> findByShopOwnerId(Integer shopOwnerId) {
        String sql = "SELECT * FROM Store WHERE ShopOwner_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, storeRowMapper, shopOwnerId);
    }

    @Override
    public List<Store> findByNameContaining(String name){
        String sql = "SELECT * FROM Store WHERE ShopName = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql,storeRowMapper,name);
    }
    @Override
    public Store save(Store store) {
        return update(store);
        /*
        if (store.getStoreId() == null) {
            return insert(store);
        } else {
            return update(store);
        }*/
    }

    private Store insert(Store store) {
        String sql = "INSERT INTO Store (ShopOwner_ID, Address_ID, name, description) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, store.getShopOwnerId());
            ps.setInt(2, store.getAddressId());
            ps.setString(3, store.getName());

            if (store.getDescription() != null) {
                ps.setString(4, store.getDescription());
            } else {
                ps.setNull(4, java.sql.Types.VARCHAR);
            }

            return ps;
        }, keyHolder);

        store.setStoreId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return store;
    }

    private Store update(Store store) {
        String sql = "UPDATE Store SET ShopOwner_ID = ?, Address_ID = ?, name = ?, description = ?,logo_url = ?, " +
                "updated_at = ? WHERE Store_ID = ?";

        jdbcTemplate.update(sql,
                store.getShopOwnerId(),
                store.getAddressId(),
                store.getName(),
                store.getDescription(),
                store.getLogo_url(),
                Timestamp.valueOf(LocalDateTime.now()),
                store.getStoreId());

        return findById(store.getStoreId()).orElse(store);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Store WHERE Store_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE Store SET deleted_at = ? WHERE Store_ID = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }
}