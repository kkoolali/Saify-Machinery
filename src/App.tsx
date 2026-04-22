/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Catalog from './pages/Catalog';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
