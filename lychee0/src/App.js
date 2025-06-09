import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
// Pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HomePage from "./DummyFiles/DummyHomePage";
import CheckOut from "./components/CheckoutForm.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage.jsx";
import AllStoresPage from "./pages/AllStoresPage.jsx";
import ProductListingPage from "./pages/AllProductsPage.jsx";
import CategoriesPage from "./pages/Categories.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import BlogAndBeauty from "./pages/BlogAndBeautyTips.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import StorePage from "./pages/StorePage.jsx";
import ContactAndSupport from "./pages/ContactAndSupport.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FAQ from "./pages/FAQ.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";

function App() {
  return (
    <UserProvider>
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
          <Route path="/blogandbeauty" element={<BlogAndBeauty />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/storepage/:storeId" element={<StorePage />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/contact" element={<ContactAndSupport />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-success/:orderId"
            element={<OrderSuccessPage />}
          />

          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["admin", "shopowner", "customer"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
