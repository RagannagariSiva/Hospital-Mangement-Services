import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// ── Auth pages (Royal Grand branded) ──
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// ── Customer pages ──
import { HotelsPage, HotelDetailPage } from './pages/customer/HotelPages';
import BookingPage        from './pages/customer/BookingPage';
import PaymentPage        from './pages/customer/PaymentPage';
import MyBookingsPage     from './pages/customer/MyBookingsPage';
import BookingConfirmPage from './pages/customer/BookingConfirmPage';
import SearchPage         from './pages/customer/SearchPage';
import HomePage           from './pages/home/HomePage';

// ── Admin pages ──
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHotels    from './pages/admin/AdminHotels';
import AdminRooms     from './pages/admin/AdminRooms';
import AdminBookings  from './pages/admin/AdminBookings';
import AdminUsers     from './pages/admin/AdminUsers';

// ── Staff pages ──
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBookings  from './pages/staff/StaffBookings';
import StaffRooms     from './pages/staff/StaffRooms';

const F = "'Inter', system-ui, -apple-system, sans-serif";
const NAVY = '#0c1f3a';

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8f6f1' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, border: `3px solid #e0ddd8`, borderTopColor: NAVY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <p style={{ fontFamily: F, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Loading Royal Grand...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/login"      element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'STAFF' ? '/staff' : '/hotels'} replace /> : <Login />} />
      <Route path="/register"   element={user ? <Navigate to="/hotels" replace /> : <Register />} />
      <Route path="/hotels"     element={<HotelsPage />} />
      <Route path="/hotels/:id" element={<HotelDetailPage />} />
      <Route path="/search"     element={<SearchPage />} />

      {/* Customer */}
      <Route path="/book/:roomId"               element={<ProtectedRoute roles={['CUSTOMER', 'ADMIN']}><BookingPage /></ProtectedRoute>} />
      <Route path="/payment/:bookingId"         element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/booking-confirm/:bookingId" element={<ProtectedRoute><BookingConfirmPage /></ProtectedRoute>} />
      <Route path="/bookings"                   element={<ProtectedRoute roles={['CUSTOMER', 'ADMIN']}><MyBookingsPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin"          element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/hotels"   element={<ProtectedRoute roles={['ADMIN']}><AdminHotels /></ProtectedRoute>} />
      <Route path="/admin/rooms"    element={<ProtectedRoute roles={['ADMIN']}><AdminRooms /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute roles={['ADMIN']}><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/users"    element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />

      {/* Staff */}
      <Route path="/staff"          element={<ProtectedRoute roles={['STAFF', 'ADMIN']}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/bookings" element={<ProtectedRoute roles={['STAFF', 'ADMIN']}><StaffBookings /></ProtectedRoute>} />
      <Route path="/staff/rooms"    element={<ProtectedRoute roles={['STAFF', 'ADMIN']}><StaffRooms /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
