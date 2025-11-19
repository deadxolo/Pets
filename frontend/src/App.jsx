import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Appointments from './pages/Appointments'
import Bookings from './pages/Bookings'
import Consultant from './pages/Consultant'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'
import Vaccination from './pages/Vaccination'
import Login from './pages/Login'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import MyAppointments from './pages/MyAppointments'
import MyBookings from './pages/MyBookings'
import PrivateRoute from './components/PrivateRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        {/* Services */}
        <Route path="services" element={<Services />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="bookings" element={<Bookings />} />

        {/* Products */}
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

        {/* Consultant */}
        <Route path="consultant" element={<Consultant />} />
        <Route path="consultant/:id" element={<ArticleDetail />} />

        {/* Contact */}
        <Route path="contact" element={<Contact />} />

        {/* Vaccination */}
        <Route path="vaccination" element={<Vaccination />} />

        {/* User Dashboard */}
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        <Route path="my-appointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
        <Route path="my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
