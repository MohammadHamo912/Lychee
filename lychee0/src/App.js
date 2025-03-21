import "./App.css";
import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";

// Pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import DummyHomePage from "./DummyFiles/DummyHomePage";

// Components
import NavBar from "./components/NavBar";
import ProductCard from "./components/ProductCard";
import ProductGrid from "./components/ProductGrid";
import ShopCard from "./components/ShopCard";
import ShopGrid from "./components/ShopGrid";
import Footer from "./components/Footer";
import ShoppingCart from "./components/ShoppingCart";
import CheckoutForm from "./components/CheckoutForm";
import FiltersPanel from "./components/FiltersPanel";
import OrderSummary from "./components/OrderSummary";
import OrderConfirmation from "./components/OrderConfirmation";
import PasswordReset from "./components/PasswordReset.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import Wishlist from "./components/WishList.jsx";
import WishListPage from "./DummyFiles/wishListPage.jsx";
import Reviews from "./components/Reviews.jsx";
import ShopOwnerDashboard from "./components/ShopOwnerDashboard.jsx";
import ProductManagement from "./components/ProductManagement.jsx";
import OrderManagement from "./components/OrderManagement.jsx";
import UserManagement from "./components/UserManagement.jsx";
import ShopApproval from "./components/ShopApproval.jsx";
import DiscountManagement from "./components/DiscountManagement.jsx";

// Dummy data and hooks
import lipgloss from "./images/lipgloss.jpeg";
import shop1Url from "./images/shop1SampleImage.png";
import { useCart } from "./Data/dummyCartData";
import { useCartCheckout } from "./Data/dummyCheckoutData";
import { dummyOrderData } from "./Data/dummyOrderData";

// Optional core components (if you have them)
import Breadcrumbs from "./components/Breadcrumbs";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import Spinner from "./components/Spinner";
import Pagination from "./components/Pagination";
import { dummyCoreData } from "./Data/dummyCoreData"; // Make sure this exists

function App() {
  /*dummy data for shopping cart */
  const { cartItems, updateQuantity, removeItem, applyPromo } = useCart();
  const { cart, calculateCartTotal, handleCheckoutSubmit } = useCartCheckout();

  /*dummy for checkout */

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/navbar" element={<NavBar />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/shops" element={<ShopGrid />} />
      <Route path="/filterspanel" element={<FiltersPanel />} />
      <Route path="/passwordreset" element={<PasswordReset />} />
      <Route path="/paymentsuccess" element={<PaymentSuccess />} />
      <Route path="/profilepage" element={<ProfilePage />} />
      <Route path="/orderhistory" element={<OrderHistory />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/wishlistpage" element={<WishListPage />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/shopownerdashboard" element={<ShopOwnerDashboard />} />
      <Route path="/productmanagement" element={<ProductManagement />} />
      <Route path="/ordermanagement" element={<OrderManagement />} />
      <Route path="/usermanagement" element={<UserManagement />} />
      <Route path="/shopapproval" element={<ShopApproval />} />
      <Route path="/discountmanagement" element={<DiscountManagement />} />
      <Route
        path="/productdetails"
        element={
          <ProductDetails
            product={{
              id: 1,
              name: "Hydrating Lip Gloss",
              imageUrl: "/images/lipgloss.jpeg",
              brand: "Lychee Cosmetics",
              price: 14.99,
              description:
                "A long-lasting lip gloss that hydrates and adds shine.",
              reviews: [
                "I love it!",
                "So smooth on the lips.",
                "Color is amazing!",
              ],
            }}
            onAddToCart={(p) => console.log("Add to cart:", p)}
          />
        }
      />

      <Route
        path="/productcard"
        element={
          <ProductCard
            product={{
              id: 1,
              name: "Lip Gloss",
              imageUrl: lipgloss,
              description: "This is a descreption",
              price: 9.99,
              shop_name: "",
            }}
            onAddToCart={(p) => console.log("Add to cart:", p)}
          />
        }
      />
      <Route path="/products" element={<ProductGrid />} />
      <Route
        path="/shopcard"
        element={
          <ShopCard
            shop={{ id: 1, name: "Loreal", logoUrl: shop1Url }}
            onViewShop={(shop) => console.log("Viewing shop:", shop)}
            featured={false}
          />
        }
      />

      <Route
        path="/shoppingcart"
        element={
          <ShoppingCart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            applyPromo={applyPromo}
          />
        }
      />

      <Route
        path="/checkout"
        element={
          <CheckoutForm
            onSubmit={handleCheckoutSubmit}
            cartTotal={calculateCartTotal()}
          />
        }
      />

      <Route
        path="/ordersummary"
        element={
          <OrderSummary
            cartItems={cartItems}
            subtotal={1000}
            tax={30}
            shipping={25}
            discount={10}
            total={1045}
            onProceedToPayment={() => console.log("Proceed to payment")}
          />
        }
      />
      <Route
        path="/orderconfirmation"
        element={
          <OrderConfirmation
            orderNumber={dummyOrderData.orderNumber}
            orderDate={dummyOrderData.orderDate}
            shippingAddress={dummyOrderData.shippingAddress}
            billingAddress={dummyOrderData.billingAddress}
            paymentMethod={dummyOrderData.paymentMethod}
            items={dummyOrderData.items}
            subtotal={dummyOrderData.subtotal}
            tax={dummyOrderData.tax}
            shipping={dummyOrderData.shipping}
            discount={dummyOrderData.discount}
            total={dummyOrderData.total}
          />
        }
      />

      <Route
        path="/breadcrumbs"
        element={<Breadcrumbs paths={dummyCoreData.breadcrumbPaths} />}
      />
      <Route
        path="/modal"
        element={
          <Modal
            isOpen={true} // Always open for testing
            onClose={() => console.log("Modal closed")}
            title="Test Modal"
          >
            <p>This is a test modal content.</p>
          </Modal>
        }
      />
      <Route
        path="/toast"
        element={
          <Toast
            message={dummyCoreData.toastMessage}
            type={dummyCoreData.toastType}
            onClose={() => console.log("Toast closed")}
            duration={3000}
          />
        }
      />
      <Route path="/spinner" element={<Spinner size={60} />} />
      <Route
        path="/pagination"
        element={
          <Pagination
            currentPage={dummyCoreData.currentPage}
            totalPages={dummyCoreData.totalPages}
            onPageChange={(page) => console.log("Page changed to:", page)}
          />
        }
      />

      <Route path="/dummyhomepage" element={<DummyHomePage />} />
    </Routes>
  );
}

export default App;
