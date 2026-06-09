import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
// Pages
import HomePage from './features/products/HomePage'
import ProductListPage from './features/products/ProductListPage'
import ProductDetailPage from './features/products/ProductDetailPage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import CartPage from './features/cart/CartPage'
import CheckoutPage from './features/checkout/CheckoutPage'
import OrderSuccessPage from './features/checkout/OrderSuccessPage'
import OrdersPage from './features/orders/OrdersPage'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App