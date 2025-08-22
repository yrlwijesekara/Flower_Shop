import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/contact';
import About from './pages/About';
import ProductDetails from './pages/ProductDetails';
import WishList from './pages/WishList';
import UserProfile from './pages/Userprofile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Contacts from './pages/admin/Contacts';
import Comments from './pages/admin/Comments';
import ResetPassword from './pages/admin/ResetPassword';
import OtherProducts from './pages/admin/OtherProducts';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="other-products" element={<OtherProducts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="comments" element={<Comments />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;