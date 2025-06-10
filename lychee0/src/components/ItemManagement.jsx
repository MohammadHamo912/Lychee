import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import { getEnrichedItemsByIds } from "../api/items";
import "../ComponentsCss/ItemManagement.css";

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemActionStates, setItemActionStates] = useState({}); // Track loading states for individual items

  // Categories
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Product checking states
  const [productCheck, setProductCheck] = useState(null);
  const [variantCheck, setVariantCheck] = useState(null);

  // Form state
  const [step, setStep] = useState("barcode"); // barcode, product, category, variant, item
  const [formData, setFormData] = useState({
    storeId: 1, // This should come from authenticated user
    barcode: "",
    productName: "",
    description: "",
    brand: "",
    imageUrl: "",
    categoryId: "",
    newCategoryName: "",
    parentCategoryId: "",
    useExistingCategory: true,
    size: "",
    color: "",
    price: "",
    stockQuantity: "",
    discount: "",
  });

  useEffect(() => {
    loadItems();
    loadMainCategories();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      console.log(
        "ItemManagement - Fetching items for store:",
        formData.storeId
      );

      const response = await fetch(
        `http://localhost:8081/api/items/enriched/store/${formData.storeId}`
      );
      const data = await response.json();

      console.log("ItemManagement - Raw items data:", data);

      setItems(data);
      setEnrichedItems(data || []);
    } catch (error) {
      console.error("Error loading items:", error);
      setError("Failed to load store items.");
    } finally {
      setLoading(false);
    }
  };

  const loadMainCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/item-management/main-categories"
      );
      const data = await response.json();
      setMainCategories(data);
    } catch (error) {
      console.error("Error loading main categories:", error);
    }
  };

  const loadSubcategories = async (parentId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/item-management/categories/${parentId}/subcategories`
      );
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Error loading subcategories:", error);
    }
  };

  // Step 1: Check barcode
  const handleBarcodeCheck = async (e) => {
    e.preventDefault();
    if (!formData.barcode.trim()) {
      setError("Please enter a barcode");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8081/api/item-management/check-product?barcode=${formData.barcode}`
      );
      const data = await response.json();
      setProductCheck(data);

      if (data.exists) {
        // Product exists, go to variant step
        setFormData((prev) => ({
          ...prev,
          productName: data.product.name,
          description: data.product.description || "",
          brand: data.product.brand || "",
          imageUrl: data.product.logoUrl || "",
        }));
        setStep("variant");
      } else {
        // Product doesn't exist, go to product creation
        setStep("product");
      }
    } catch (error) {
      setError("Error checking product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Check variant (for existing products)
  const handleVariantCheck = async (e) => {
    e.preventDefault();
    const size = formData.size || "default";
    const color = formData.color || "default";

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8081/api/item-management/check-variant?productId=${productCheck.product.productId}&size=${size}&color=${color}`
      );
      const data = await response.json();
      setVariantCheck(data);

      // Always proceed to item step whether variant exists or not
      setStep("item");
    } catch (error) {
      setError("Error checking variant: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Load subcategories when parent category changes
    if (name === "parentCategoryId" && value) {
      loadSubcategories(value);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8081/api/images/upload/ProductsImages",
        {
          method: "POST",
          body: formDataUpload,
        }
      );
      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        alert("Failed to upload image: " + data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Submit final item
  const handleSubmitItem = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const requestData = {
        storeId: formData.storeId,
        barcode: formData.barcode.trim() || null,
        productName: formData.productName.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim() || null,
        imageUrl: formData.imageUrl || null,
        categoryId: formData.useExistingCategory ? formData.categoryId : null,
        newCategoryName: !formData.useExistingCategory
          ? formData.newCategoryName.trim()
          : null,
        parentCategoryId: !formData.useExistingCategory
          ? formData.parentCategoryId
          : null,
        size: formData.size.trim() || "default",
        color: formData.color.trim() || "default",
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        discount: parseFloat(formData.discount) || 0,
      };

      const response = await fetch(
        "http://localhost:8081/api/item-management/create-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Item created successfully!");
        resetForm();
        loadItems();
        setShowForm(false);
      } else {
        setError("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating item:", error);
      setError("Failed to create item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.productName.trim()) {
      setError("Product name is required");
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return false;
    }

    if (step === "product") {
      if (!formData.useExistingCategory && !formData.newCategoryName.trim()) {
        setError("Category name is required when creating new category");
        return false;
      }

      if (!formData.useExistingCategory && !formData.parentCategoryId) {
        setError("Parent category is required when creating new category");
        return false;
      }

      if (formData.useExistingCategory && !formData.categoryId) {
        setError("Please select a category");
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      storeId: 1,
      barcode: "",
      productName: "",
      description: "",
      brand: "",
      imageUrl: "",
      categoryId: "",
      newCategoryName: "",
      parentCategoryId: "",
      useExistingCategory: true,
      size: "",
      color: "",
      price: "",
      stockQuantity: "",
      discount: "",
    });
    setStep("barcode");
    setProductCheck(null);
    setVariantCheck(null);
    setSubcategories([]);
    setError("");
  };

  const handleEditItem = async (item) => {
    try {
      console.log("ItemManagement - Editing item:", item);

      setEditingItem(item);

      // Populate form with item data for editing
      setFormData({
        storeId: item.storeId,
        barcode: item.barcode || "",
        productName: item.productName,
        description: item.productDescription || "",
        brand: item.brand || "",
        imageUrl: item.productLogoUrl || "",
        categoryId: "", // You might want to fetch this
        newCategoryName: "",
        parentCategoryId: "",
        useExistingCategory: true,
        size: item.size || "default",
        color: item.color || "default",
        price: item.price.toString(),
        stockQuantity: item.stockQuantity.toString(),
        discount: item.discount.toString(),
      });

      setShowForm(true);
      setStep("item"); // Skip to item details step for editing
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error preparing item for edit:", error);
      setError("Failed to prepare item for editing");
    }
  };

  const handleDeleteItem = async (item) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${item.productName}" from your store?`
      )
    )
      return;

    try {
      console.log("ItemManagement - Deleting item:", item);

      // Set loading state for this specific item
      setItemActionStates((prev) => ({ ...prev, [item.itemId]: "deleting" }));

      const response = await fetch(
        `http://localhost:8081/api/items/${item.itemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Item successfully deleted from store!");

        // Update local state by removing the item
        setItems((prev) => prev.filter((i) => i.itemId !== item.itemId));
        setEnrichedItems((prev) =>
          prev.filter((i) => i.itemId !== item.itemId)
        );

        // You could show a success message or toast here
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("❌ Error deleting item:", error);
      setError("Failed to remove item from store: " + error.message);
    } finally {
      // Clear loading state for this specific item
      setItemActionStates((prev) => ({ ...prev, [item.itemId]: null }));
    }
  };

  const applyFilters = (newFilters) => {
    let results = [...enrichedItems];

    if (newFilters.category !== "All") {
      results = results.filter(
        (item) => item.categoryName === newFilters.category
      );
    }

    if (newFilters.minPrice) {
      results = results.filter(
        (item) => parseFloat(item.price) >= parseFloat(newFilters.minPrice)
      );
    }

    if (newFilters.maxPrice) {
      results = results.filter(
        (item) => parseFloat(item.price) <= parseFloat(newFilters.maxPrice)
      );
    }
  };

  // Render different form steps
  const renderBarcodeStep = () => (
    <div className="form-step">
      <h4>Step 1: Enter Barcode</h4>
      <form onSubmit={handleBarcodeCheck}>
        <div className="pm-form-group">
          <input
            name="barcode"
            placeholder="Enter or scan barcode"
            value={formData.barcode}
            onChange={handleInputChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check Product"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderProductStep = () => (
    <div className="form-step">
      <h4>Step 2: Product Details (New Product)</h4>
      <div className="pm-form-group">
        <input
          name="productName"
          placeholder="Product Name *"
          value={formData.productName}
          onChange={handleInputChange}
          required
        />
        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleInputChange}
        />
      </div>

      <textarea
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={handleInputChange}
        rows="3"
      />

      {/* Category Selection */}
      <div className="category-section">
        <h5>Category</h5>
        <div className="category-toggle">
          <label>
            <input
              type="radio"
              checked={formData.useExistingCategory}
              onChange={() =>
                setFormData((prev) => ({ ...prev, useExistingCategory: true }))
              }
            />
            Use Existing Category
          </label>
          <label>
            <input
              type="radio"
              checked={!formData.useExistingCategory}
              onChange={() =>
                setFormData((prev) => ({ ...prev, useExistingCategory: false }))
              }
            />
            Create New Category
          </label>
        </div>

        {formData.useExistingCategory ? (
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category *</option>
            {mainCategories.map((mainCat) => (
              <optgroup key={mainCat.categoryId} label={mainCat.name}>
                {subcategories
                  .filter((sub) => sub.parentId === mainCat.categoryId)
                  .map((subCat) => (
                    <option key={subCat.categoryId} value={subCat.categoryId}>
                      {subCat.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        ) : (
          <div className="new-category-form">
            <select
              name="parentCategoryId"
              value={formData.parentCategoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Parent Category *</option>
              {mainCategories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
              {subcategories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              name="newCategoryName"
              placeholder="New Category Name *"
              value={formData.newCategoryName}
              onChange={handleInputChange}
              required={!formData.useExistingCategory}
            />
          </div>
        )}
      </div>

      <div className="image-upload">
        <label>Product Image:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="image-preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        )}
      </div>

      <div className="step-actions">
        <button type="button" onClick={() => setStep("variant")}>
          Continue to Variants
        </button>
      </div>
    </div>
  );

  const renderVariantStep = () => (
    <div className="form-step">
      <h4>Step 3: Product Variants</h4>
      {productCheck?.exists && (
        <div className="existing-product-info">
          <p>
            <strong>Existing Product:</strong> {productCheck.product.name}
          </p>
          <p>
            <strong>Brand:</strong> {productCheck.product.brand}
          </p>
        </div>
      )}

      <form onSubmit={handleVariantCheck}>
        <div className="pm-form-group">
          <input
            name="size"
            placeholder="Size (e.g., 50ml, Large) or leave empty for default"
            value={formData.size}
            onChange={handleInputChange}
          />
          <input
            name="color"
            placeholder="Color/Shade (e.g., Red, #001) or leave empty for default"
            value={formData.color}
            onChange={handleInputChange}
          />
        </div>

        <div className="step-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Continue to Item Details"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderItemStep = () => (
    <div className="form-step">
      <h4>Step 4: Item Details</h4>

      {variantCheck && (
        <div
          className={`variant-status ${
            variantCheck.exists ? "warning" : "success"
          }`}
        >
          {variantCheck.exists
            ? "⚠️ Variant exists - will use existing variant"
            : "✓ New variant will be created"}
        </div>
      )}

      <form onSubmit={handleSubmitItem}>
        <div className="pm-form-group">
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price *"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <input
            name="stockQuantity"
            type="number"
            min="0"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
          />
          <input
            name="discount"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="Discount %"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>

        <div className="step-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Item"}
          </button>
          <button type="button" onClick={resetForm}>
            Start Over
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="pm-container">
      <div className="pm-header">
        <h2>Item Management</h2>
        <button className="pm-add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add New Item"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add Item Form */}
      {showForm && (
        <div className="pm-form-card">
          <h3>Add New Item</h3>

          <div className="step-indicator">
            <div
              className={`step ${
                step === "barcode"
                  ? "active"
                  : step !== "barcode"
                  ? "completed"
                  : ""
              }`}
            >
              1. Barcode
            </div>
            <div className={`step ${step === "product" ? "active" : ""}`}>
              2. Product
            </div>
            <div className={`step ${step === "variant" ? "active" : ""}`}>
              3. Variant
            </div>
            <div className={`step ${step === "item" ? "active" : ""}`}>
              4. Item
            </div>
          </div>

          {step === "barcode" && renderBarcodeStep()}
          {step === "product" && renderProductStep()}
          {step === "variant" && renderVariantStep()}
          {step === "item" && renderItemStep()}
        </div>
      )}

      {/* Items List */}
      <div className="pm-layout">
        <div className="items-section">
          <div className="items-header">
            <h3>Your Store Items</h3>
            <div className="items-count">
              {enrichedItems.length}{" "}
              {enrichedItems.length === 1 ? "item" : "items"}
            </div>
          </div>

          {/* Show loading state */}
          {loading && (
            <div className="loading-message">
              <p>Loading your store items...</p>
            </div>
          )}

          {/* Show error state */}
          {error && !loading && (
            <div className="error-message">
              <p className="error">{error}</p>
            </div>
          )}

          {/* Items Grid */}
          {enrichedItems.length > 0 && !loading && (
            <div className="items-grid">
              {enrichedItems.map((item) => {
                const isItemLoading = itemActionStates[item.itemId];

                return (
                  <div key={item.itemId} className="item-wrapper">
                    <ItemCard
                      item={item}
                      onAddToCart={() => {}} // Disable add to cart for store owners viewing their own items
                      isAddingToCart={false}
                      allItems={enrichedItems}
                      showAddToCart={false} // Don't show add to cart for store owners
                    />

                    {/* Store management actions overlay */}
                    <div className="store-item-actions">
                      <button
                        className="edit-item-btn"
                        onClick={() => handleEditItem(item)}
                        disabled={isItemLoading}
                        title="Edit item details"
                      >
                        ✏️ Edit Item
                      </button>
                      <button
                        className="remove-item-btn"
                        onClick={() => handleDeleteItem(item)}
                        disabled={isItemLoading}
                        title="Remove from store"
                      >
                        {isItemLoading === "deleting"
                          ? "⏳ Removing..."
                          : "🗑️ Remove from Store"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;
