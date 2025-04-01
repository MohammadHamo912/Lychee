import React from "react";
import { Routes, Route } from "react-router-dom";

import lipgloss from "./images/lipgloss.jpeg"; // Update path if necessary
import shop1Url from "./images/shop1SampleImage.png"; // Update path if necessary

// Pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import DummyHomePage from "./DummyFiles/DummyHomePage";
import ShopByCategory from "./pages/ShopByCategoryPage.jsx";
import Search from "./pages/Search.jsx";
import ProductDetails from "./pages/ProductDetailsPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
// Components
import NavBar from "./components/NavBar"; // DONE
import ProductCard from "./components/ProductCard"; // DONE
import ProductGrid from "./components/ProductGrid"; // DONE
import ShopCard from "./components/ShopCard"; // DONE
import ShopGrid from "./components/ShopGrid"; // DONE
import Footer from "./components/Footer"; // DONE
import ShoppingCart from "./components/ShoppingCart"; // DONE
import CheckoutForm from "./components/CheckoutForm"; // DONE
import FiltersPanel from "./components/FiltersPanel";
import ShopOwnerDashboard from "./components/ShopOwnerDashboard.jsx";
import OrderSummary from "./components/OrderSummary.jsx";
import OrderConfirmation from "./components/OrderConfirmation.jsx";
import HeroSection from "./components/HeroSection.jsx"; // DONE
import CategoryGrid from "./components/CategoryGrid"; // DONE
import TrendingProducts from "./components/TrendingProducts"; // DONE
import StoreHighlights from "./components/StoreHighlights"; // DONE
import ProfilePage from "./components/ProfilePage.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import Breadcrumbs from "./components/Breadcrumbs";
import Modal from "./components/Modal.jsx";
import Toast from "./components/Toast";
import Spinner from "./components/Spinner";
import Pagination from "./components/Pagination";
import DiscountManagement from "./pages/admin/DiscountManagement.jsx";
import ShopApproval from "./pages/admin/ShopApproval.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import BlogAndBeauty from "./pages/BlogAndBeautyTips.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
import StorePage from "./pages/StorePage.jsx";
import ContactAndSupport from "./pages/ContactAndSupport.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FAQ from "./pages/FAQ.jsx";
import Sidebar from "./components/Sidebar.jsx";
import UserManagment from "./pages/admin/UserManagement.jsx"; // Keep SearchBar separate
// dummy imports
import { useCart } from "./Data/dummyCartData.js";
import { useCartCheckout } from "./Data/dummyCheckoutData.js";
import { dummyOrderData } from "./Data/dummyOrderData.js";
import { dummyCoreData } from "./Data/dummyCoreData.js";

import dummyProducts from "./Data/dummyProducts.js";
function App() {
  /*dummy data for shopping cart */
  const { cartItems, updateQuantity, removeItem, applyPromo } = useCart();
  const { cart, calculateCartTotal, handleCheckoutSubmit } = useCartCheckout();

  /*dummy for checkout */

  return (
    <div>
      <Routes>
        <Route path="shoppingcartpage" component={<ShoppingCartPage />}></Route>
        <Route path="/shopownerdashboard" element={<ShopOwnerDashboard />} />
        <Route path="/blogandbeauty" element={<BlogAndBeauty />} />
        <Route path="/ownerdashboard" element={<OwnerDashboard />} />
        <Route path="/admin/usermanagement" element={<UserManagment />} />
        <Route path="/admin/shopapproval" element={<ShopApproval />} />
        <Route
          path="/admin/discountmanagment"
          element={<DiscountManagement />}
        />
        <Route
          path="/"
          element={<div style={{ padding: 40 }}>Home Test</div>}
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/homepage" element={<DummyHomePage />} />
        <Route path="/dummyhomepage" element={<DummyHomePage />} />

        <Route
          path="/"
          element={<div style={{ padding: 40 }}>Home Test</div>}
        />

        {/*to test this type http://localhost:3000/product/{the id of the component } 
        example:
        http://localhost:3000/product/1
        */}
        <Route path="/category/:category" element={<ShopByCategory />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/storepage" element={<StorePage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/shops" element={<ShopGrid />} />
        <Route path="/filterspanel" element={<FiltersPanel />} />
        <Route path="/herosection" element={<HeroSection />} />
        <Route path="/categorygrid" element={<CategoryGrid />} />
        <Route path="/trendingproducts" element={<TrendingProducts />} />
        <Route path="/storehighlights" element={<StoreHighlights />} />
        <Route path="/discountmanagement" element={<DiscountManagement />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/pagenotfound" element={<NotFoundPage />} />
        <Route path="/contactandsupport" element={<ContactAndSupport />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/productcard"
          element={
            <ProductCard
              product={dummyProducts[0]}
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
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>Not Found</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
