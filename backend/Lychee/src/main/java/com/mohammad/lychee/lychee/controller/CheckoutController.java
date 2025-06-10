package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.dto.CheckoutDTO;
import com.mohammad.lychee.lychee.dto.CartEnrichedItem;
import com.mohammad.lychee.lychee.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:3000")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    // GET /api/checkout/cart/{userId} - Get user's cart items with full details
    @GetMapping("/cart/{userId}")
    public ResponseEntity<List<CartEnrichedItem>> getCartItems(@PathVariable Integer userId) {
        try {
            System.out.println("CheckoutController - Getting cart items for user: " + userId);

            List<CartEnrichedItem> cartItems = checkoutService.getCartItems(userId);

            System.out.println("CheckoutController - Retrieved " + cartItems.size() + " cart items");
            return ResponseEntity.ok(cartItems);

        } catch (Exception e) {
            System.err.println("CheckoutController - Error getting cart items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/checkout/process - Process complete checkout with dummy payment
    @PostMapping("/process")
    public ResponseEntity<CheckoutDTO.CheckoutResponseDTO> processCheckout(@RequestBody CheckoutDTO checkoutData) {
        try {
            System.out.println("CheckoutController - Processing checkout for user: " + checkoutData.getUser_id());

            // Validate required fields
            if (checkoutData.getUser_id() == null) {
                return ResponseEntity.badRequest().body(
                        new CheckoutDTO.CheckoutResponseDTO(false, null, "User ID is required")
                );
            }

            if (checkoutData.getShipping_address() == null) {
                return ResponseEntity.badRequest().body(
                        new CheckoutDTO.CheckoutResponseDTO(false, null, "Shipping address is required")
                );
            }


            CheckoutDTO.CheckoutResponseDTO response = checkoutService.processCheckout(checkoutData);

            if (response.isSuccess()) {
                System.out.println("CheckoutController - Checkout successful. order ID: " + response.getOrder_id());
                return ResponseEntity.ok(response);
            } else {
                System.out.println("CheckoutController - Checkout failed: " + response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            System.err.println("CheckoutController - Error processing checkout: " + e.getMessage());
            e.printStackTrace();

            CheckoutDTO.CheckoutResponseDTO errorResponse = new CheckoutDTO.CheckoutResponseDTO(
                    false, null, "Failed to process checkout: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }



}