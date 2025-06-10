package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.ItemImage;
import com.mohammad.lychee.lychee.repository.ItemImageRepository;
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
public class ItemImageRepositoryImpl implements ItemImageRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ItemImageRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ItemImage> itemImageRowMapper = (rs, rowNum) -> {
        ItemImage itemImage = new ItemImage();
        itemImage.setImageId(rs.getInt("Image_ID"));
        itemImage.setItemId(rs.getInt("Item_ID"));
        itemImage.setImageUrl(rs.getString("image_url"));
        itemImage.setCaption(rs.getString("caption"));
        return itemImage;
    };

    @Override
    public List<ItemImage> findAll() {
        String sql = "SELECT * FROM item_images";
        return jdbcTemplate.query(sql, itemImageRowMapper);
    }

    @Override
    public Optional<ItemImage> findById(Integer id) {
        try {
            String sql = "SELECT * FROM item_images WHERE Image_ID = ?";
            ItemImage itemImage = jdbcTemplate.queryForObject(sql, itemImageRowMapper, id);
            return Optional.ofNullable(itemImage);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ItemImage> findByItemId(Integer itemId) {
        String sql = "SELECT * FROM item_images WHERE Item_ID = ?";
        return jdbcTemplate.query(sql, itemImageRowMapper, itemId);
    }

    @Override
    public ItemImage save(ItemImage itemImage) {
        return update(itemImage);
        /*
        if (itemImage.getImageId() == null) {
            return insert(itemImage);
        } else {
            return update(itemImage);
        }*/
    }

    private ItemImage insert(ItemImage itemImage) {
        String sql = "INSERT INTO item_images (Item_ID, image_url, caption) VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, itemImage.getItemId());
            ps.setString(2, itemImage.getImageUrl());

            if (itemImage.getCaption() != null) {
                ps.setString(3, itemImage.getCaption());
            } else {
                ps.setNull(3, java.sql.Types.VARCHAR);
            }

            return ps;
        }, keyHolder);

        itemImage.setImageId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return itemImage;
    }

    private ItemImage update(ItemImage itemImage) {
        String sql = "UPDATE item_images SET Item_ID = ?, image_url = ?, caption = ? WHERE Image_ID = ?";

        jdbcTemplate.update(sql,
                itemImage.getItemId(),
                itemImage.getImageUrl(),
                itemImage.getCaption(),
                itemImage.getImageId());

        return findById(itemImage.getImageId()).orElse(itemImage);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM item_images WHERE Image_ID = ?";
        jdbcTemplate.update(sql, id);
    }
}