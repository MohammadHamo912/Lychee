import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HomePage from "./DummyFiles/DummyHomePage";
import ShopByCategory from "./pages/ShopByCategoryPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ProductDetails from "./pages/ProductDetailsPage.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import CheckOut from "./components/CheckoutForm.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage.jsx";
import OwnerDashboard from "./components/OwnerDashboard.jsx";
import AllStoresPage from "./pages/AllStoresPage.jsx";
import ProductListingPage from "./pages/AllProductsPage.jsx";
import CategoriesPage from "./pages/Categories.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ShopOwnerDashboard from "./components/ShopOwnerDashboard.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import BlogAndBeauty from "./pages/BlogAndBeautyTips.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import StorePage from "./pages/StorePage.jsx";
import ContactAndSupport from "./pages/ContactAndSupport.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FAQ from "./pages/FAQ.jsx";
import dummyProducts from "./Data/dummyProducts.js";
import ProductCard from "./components/ProductCard.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Lychee" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/productlistingpage" element={<ProductListingPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/allstorespage" element={<AllStoresPage />} />
        <Route path="/shoppingcartpage" element={<ShoppingCartPage />} />
        <Route path="/shopownerdashboard" element={<ShopOwnerDashboard />} />
        <Route path="/blogandbeauty" element={<BlogAndBeauty />} />
        <Route path="/ownerdashboard" element={<OwnerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/category/:category" element={<ShopByCategory />} />
        <Route path="/item/:item" element={<ItemPage />} />
        <Route path="/storepage" element={<StorePage />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/contact" element={<ContactAndSupport />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/search-products"
          element={
            <SearchPage
              searchType="products"
              data={dummyProducts}
              renderCard={(product) => <ProductCard product={product} />}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
