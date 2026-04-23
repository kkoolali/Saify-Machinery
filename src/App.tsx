/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CompareEngine from './components/CompareEngine';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareEngine />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </CompareProvider>
    </AuthProvider>
  );
}
