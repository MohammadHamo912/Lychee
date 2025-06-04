package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.dto.EnrichedItem;
import com.mohammad.lychee.lychee.repository.EnrichedItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class EnrichedItemRepositoryImpl implements EnrichedItemRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Simple base query - no complex joins that might cause issues
    private static final String BASE_ENRICHED_QUERY = """
        SELECT 
            i.Item_ID as itemId,
            i.Store_ID as storeId,
            i.Product_Variant_ID as productVariantId,
            i.price,
            i.discount,
            i.stockQuantity as stockQuantity,
            i.created_at as itemCreatedAt,
            i.updated_at as itemUpdatedAt,
            i.deleted_at as itemDeletedAt,
            COALESCE(p.name, 'Unknown Product') as productName,
            COALESCE(p.description, 'No description') as productDescription,
            COALESCE(p.brand, 'Unknown Brand') as productBrand,
            COALESCE(p.barcode, '') as productBarcode,
            COALESCE(p.logo_url, '') as productImage,
            COALESCE(pv.size, 'default') as variantSize,
            COALESCE(pv.color, 'default') as variantColor,
            COALESCE(s.name, 'Unknown Store') as storeName,
            COALESCE(p.Product_ID, 0) as productId
        FROM Item i
        LEFT JOIN ProductVariant pv ON i.Product_Variant_ID = pv.Product_Variant_ID
        LEFT JOIN Product p ON pv.Product_ID = p.Product_ID
        LEFT JOIN Store s ON i.Store_ID = s.Store_ID
        WHERE i.deleted_at IS NULL
    """;

    // Simple RowMapper for EnrichedItem
    private final RowMapper<EnrichedItem> enrichedItemRowMapper = (rs, rowNum) -> {
        EnrichedItem item = new EnrichedItem();

        // Item fields
        item.setItemId(rs.getInt("itemId"));
        item.setStoreId(rs.getInt("storeId"));
        item.setProductVariantId(rs.getInt("productVariantId"));
        item.setPrice(rs.getBigDecimal("price"));
        item.setDiscount(rs.getBigDecimal("discount"));
        item.setStockQuantity(rs.getInt("stockQuantity"));
        item.setCreatedAt(rs.getTimestamp("itemCreatedAt") != null ?
                rs.getTimestamp("itemCreatedAt").toLocalDateTime() : null);
        item.setUpdatedAt(rs.getTimestamp("itemUpdatedAt") != null ?
                rs.getTimestamp("itemUpdatedAt").toLocalDateTime() : null);
        item.setDeletedAt(rs.getTimestamp("itemDeletedAt") != null ?
                rs.getTimestamp("itemDeletedAt").toLocalDateTime() : null);

        // Product fields (enriched)
        item.setName(rs.getString("productName"));
        item.setDescription(rs.getString("productDescription"));
        item.setBrand(rs.getString("productBrand"));
        item.setBarcode(rs.getString("productBarcode"));
        item.setImage(rs.getString("productImage"));

        // Store info
        item.setStoreName(rs.getString("storeName"));

        // Current variant - simple version
        Integer productId = rs.getInt("productId");
        if (productId > 0) {
            EnrichedItem.CurrentVariant currentVariant = new EnrichedItem.CurrentVariant(
                    rs.getInt("productVariantId"),
                    productId,
                    rs.getString("variantSize"),
                    rs.getString("variantColor")
            );
            item.setCurrentVariant(currentVariant);
        }

        // Set empty available variants (no complex enrichment for now)
        item.setAvailableVariants(new ArrayList<>());

        return item;
    };

    @Override
    public List<EnrichedItem> findAllEnriched() {
        try {
            System.out.println("SimpleRepository - Executing findAllEnriched query");
            List<EnrichedItem> items = jdbcTemplate.query(BASE_ENRICHED_QUERY, enrichedItemRowMapper);
            System.out.println("SimpleRepository - Found " + items.size() + " enriched items");
            return items;
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error in findAllEnriched: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Optional<EnrichedItem> findEnrichedById(Integer itemId) {
        try {
            System.out.println("SimpleRepository - Finding enriched item by ID: " + itemId);
            String query = BASE_ENRICHED_QUERY + " AND i.Item_ID = ?";

            EnrichedItem item = jdbcTemplate.queryForObject(query, enrichedItemRowMapper, itemId);

            if (item != null) {
                System.out.println("SimpleRepository - Found enriched item: " + item.getName());
                return Optional.of(item);
            }

            return Optional.empty();
        } catch (EmptyResultDataAccessException e) {
            System.out.println("SimpleRepository - No enriched item found with ID: " + itemId);
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error finding enriched item by ID: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> findEnrichedByStoreId(Integer storeId) {
        try {
            System.out.println("SimpleRepository - Finding enriched items by store ID: " + storeId);
            String query = BASE_ENRICHED_QUERY + " AND i.Store_ID = ?";

            List<EnrichedItem> items = jdbcTemplate.query(query, enrichedItemRowMapper, storeId);

            System.out.println("SimpleRepository - Found " + items.size() + " enriched items for store " + storeId);
            return items;
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error finding enriched items by store: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> findEnrichedTrending() {
        try {
            System.out.println("SimpleRepository - Finding enriched trending items");
            String query = BASE_ENRICHED_QUERY + " ORDER BY i.created_at DESC LIMIT 10";

            List<EnrichedItem> items = jdbcTemplate.query(query, enrichedItemRowMapper);

            System.out.println("SimpleRepository - Found " + items.size() + " trending items");
            return items;
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error finding trending items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> searchEnriched(String query) {
        try {
            System.out.println("SimpleRepository - Searching enriched items with query: " + query);
            String searchQuery = BASE_ENRICHED_QUERY +
                    " AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)";

            String searchPattern = "%" + query + "%";
            List<EnrichedItem> items = jdbcTemplate.query(searchQuery, enrichedItemRowMapper,
                    searchPattern, searchPattern, searchPattern);

            System.out.println("SimpleRepository - Found " + items.size() + " items for search: " + query);
            return items;
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error searching enriched items: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> searchEnrichedInStore(Integer storeId, String query) {
        try {
            System.out.println("SimpleRepository - Searching enriched items in store " + storeId + " with query: " + query);
            String searchQuery = BASE_ENRICHED_QUERY +
                    " AND i.Store_ID = ? AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)";

            String searchPattern = "%" + query + "%";
            List<EnrichedItem> items = jdbcTemplate.query(searchQuery, enrichedItemRowMapper,
                    storeId, searchPattern, searchPattern, searchPattern);

            System.out.println("SimpleRepository - Found " + items.size() + " items for store search");
            return items;
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error searching enriched items in store: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<EnrichedItem> findEnrichedByIds(List<Integer> itemIds) {
        try {
            System.out.println("SimpleRepository - Finding enriched items by IDs: " + itemIds);

            if (itemIds == null || itemIds.isEmpty()) {
                return new ArrayList<>();
            }

            String placeholders = itemIds.stream().map(id -> "?").collect(Collectors.joining(","));
            String query = BASE_ENRICHED_QUERY + " AND i.Item_ID IN (" + placeholders + ")";

            List<EnrichedItem> items = jdbcTemplate.query(query, enrichedItemRowMapper, itemIds.toArray());

            System.out.println("SimpleRepository - Found " + items.size() + " enriched items by IDs");
            return items;
        } catch (Exception e) {
            System.err.println("SimpleRepository - Error finding enriched items by IDs: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}