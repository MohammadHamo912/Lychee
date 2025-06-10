package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.ItemImage;
import com.mohammad.lychee.lychee.service.ItemImageService;
import com.mohammad.lychee.lychee.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/item-images")
@CrossOrigin(origins = "*")
public class ItemImageController {

    @Autowired
    private ItemImageService itemImageService;

    @Autowired
    private S3Service s3Service;

    // Get all item images
    @GetMapping
    public ResponseEntity<List<ItemImage>> getAllItemImages() {
        List<ItemImage> itemImages = itemImageService.getAllItemImages();
        return ResponseEntity.ok(itemImages);
    }

    // Get item image by ID
    @GetMapping("/{imageId}")
    public ResponseEntity<?> getItemImageById(@PathVariable Integer imageId) {
        Optional<ItemImage> itemImage = itemImageService.getItemImageById(imageId);
        if (itemImage.isPresent()) {
            return ResponseEntity.ok(itemImage.get());
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Item image not found with ID: " + imageId);
            return ResponseEntity.notFound().build();
        }
    }

    // Get all images for a specific item
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ItemImage>> getItemImagesByItemId(@PathVariable Integer itemId) {
        List<ItemImage> itemImages = itemImageService.getItemImagesByItemId(itemId);
        return ResponseEntity.ok(itemImages);
    }

    // Upload image and create ItemImage record
    @PostMapping("/upload")
    public ResponseEntity<?> uploadItemImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam("itemId") Integer itemId,
            @RequestParam(value = "caption", required = false) String caption) {

        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("No file provided"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(createErrorResponse("File must be an image"));
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(createErrorResponse("File size must be less than 5MB"));
            }

            // Upload to S3
            String imageUrl = s3Service.uploadFile(file, "item-images");

            // Create ItemImage record
            ItemImage itemImage = new ItemImage();
            itemImage.setItem_id(itemId);
            itemImage.setImage_url(imageUrl);
            itemImage.setCaption(caption);

            ItemImage savedItemImage = itemImageService.createItemImage(itemImage);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item image uploaded successfully");
            response.put("itemImage", savedItemImage);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Upload failed: " + e.getMessage()));
        }
    }

    // Create ItemImage record with existing image URL
    @PostMapping
    public ResponseEntity<?> createItemImage(@RequestBody ItemImage itemImage) {
        try {
            ItemImage savedItemImage = itemImageService.createItemImage(itemImage);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item image created successfully");
            response.put("itemImage", savedItemImage);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to create item image: " + e.getMessage()));
        }
    }

    // Update ItemImage record
    @PutMapping("/{imageId}")
    public ResponseEntity<?> updateItemImage(
            @PathVariable Integer imageId,
            @RequestBody ItemImage itemImage) {
        try {
            itemImage.setImage_id(imageId);
            ItemImage updatedItemImage = itemImageService.updateItemImage(itemImage);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item image updated successfully");
            response.put("itemImage", updatedItemImage);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to update item image: " + e.getMessage()));
        }
    }

    // Update only caption
    @PatchMapping("/{imageId}/caption")
    public ResponseEntity<?> updateItemImageCaption(
            @PathVariable Integer imageId,
            @RequestBody Map<String, String> request) {
        try {
            Optional<ItemImage> existingImage = itemImageService.getItemImageById(imageId);
            if (existingImage.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ItemImage itemImage = existingImage.get();
            itemImage.setCaption(request.get("caption"));

            ItemImage updatedItemImage = itemImageService.updateItemImage(itemImage);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Caption updated successfully");
            response.put("itemImage", updatedItemImage);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to update caption: " + e.getMessage()));
        }
    }

    // Replace image (upload new image and update record)
    @PutMapping("/{imageId}/replace-image")
    public ResponseEntity<?> replaceItemImage(
            @PathVariable Integer imageId,
            @RequestParam("image") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption) {

        try {
            // Check if item image exists
            Optional<ItemImage> existingImage = itemImageService.getItemImageById(imageId);
            if (existingImage.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Validate new file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("No file provided"));
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(createErrorResponse("File must be an image"));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(createErrorResponse("File size must be less than 5MB"));
            }

            ItemImage currentImage = existingImage.get();
            String oldImageUrl = currentImage.getImage_url();

            // Upload new image
            String newImageUrl = s3Service.uploadFile(file, "item-images");

            // Update record
            currentImage.setImage_url(newImageUrl);
            if (caption != null) {
                currentImage.setCaption(caption);
            }

            ItemImage updatedItemImage = itemImageService.updateItemImage(currentImage);

            // Delete old image from S3
            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                try {
                    s3Service.deleteFile(oldImageUrl);
                } catch (Exception e) {
                    System.err.println("Warning: Failed to delete old image: " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item image replaced successfully");
            response.put("itemImage", updatedItemImage);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to replace image: " + e.getMessage()));
        }
    }

    // Delete ItemImage record and associated S3 image
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteItemImage(@PathVariable Integer imageId) {
        try {
            // Get the item image to retrieve the image URL
            Optional<ItemImage> itemImage = itemImageService.getItemImageById(imageId);
            if (itemImage.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String imageUrl = itemImage.get().getImage_url();

            // Delete from database
            itemImageService.deleteItemImage(imageId);

            // Delete from S3
            if (imageUrl != null && !imageUrl.isEmpty()) {
                try {
                    s3Service.deleteFile(imageUrl);
                } catch (Exception e) {
                    System.err.println("Warning: Failed to delete image from S3: " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Item image deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to delete item image: " + e.getMessage()));
        }
    }

    // Delete multiple item images by item ID
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<?> deleteItemImagesByItemId(@PathVariable Integer itemId) {
        try {
            List<ItemImage> itemImages = itemImageService.getItemImagesByItemId(itemId);

            for (ItemImage itemImage : itemImages) {
                // Delete from database
                itemImageService.deleteItemImage(itemImage.getImage_id());

                // Delete from S3
                if (itemImage.getImage_url() != null && !itemImage.getImage_url().isEmpty()) {
                    try {
                        s3Service.deleteFile(itemImage.getImage_url());
                    } catch (Exception e) {
                        System.err.println("Warning: Failed to delete image from S3: " + e.getMessage());
                    }
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All item images deleted successfully");
            response.put("deletedCount", itemImages.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to delete item images: " + e.getMessage()));
        }
    }

    // Helper method to create error response
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return errorResponse;
    }
}