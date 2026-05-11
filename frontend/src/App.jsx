import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminTourPackages from "./pages/admin/AdminTourPackages";
import AdminClients from "./pages/admin/AdminClients";

import UserDashboard from "./pages/user/UserDashboard";
import UserBookings from "./pages/user/UserBookings";
import UserClients from "./pages/user/UserClients";
import UserHotels from "./pages/user/UserHotels";
import UserPayments from "./pages/user/UserPayments";
import UserTourPackages from "./pages/user/UserTourPackages";
import UserTransportation from "./pages/user/UserTransportation";
import UserTrips from "./pages/user/UserTrips";

import BookingWizard from "./pages/bookings/BookingWizard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route element={<Layout role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/employees" element={<AdminEmployees />} />
              <Route
                path="/admin/tour-packages"
                element={<AdminTourPackages />}
              />
              <Route path="/admin/clients" element={<AdminClients />} />
            </Route>
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout role="user" />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/bookings" element={<UserBookings />} />
              <Route path="/user/clients" element={<UserClients />} />
              <Route path="/user/hotels" element={<UserHotels />} />
              <Route path="/user/payments" element={<UserPayments />} />
              <Route
                path="/user/tour-packages"
                element={<UserTourPackages />}
              />
              <Route
                path="/user/transportation"
                element={<UserTransportation />}
              />
              <Route path="/user/trips" element={<UserTrips />} />
              <Route path="/bookings/step/:step" element={<BookingWizard />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
