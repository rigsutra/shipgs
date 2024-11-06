import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/layout/Header";
import Loader from "./components/layout/Loader";
import ProtectRoute from "./components/auth/ProtectedRoute";
import AdminProtectRoute from "./components/auth/AdminProtectRoute";

const Home = lazy(() => import("./pages/Home"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Addresses = lazy(() => import("./pages/Addresses"));
const CreateAddresses = lazy(() => import("./pages/CreateAddressess"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CreateOrders = lazy(() => import("./pages/CreateOrders"));
const FedexOrderList = lazy(() => import("./pages/FedexOrderList"));
const CreateFedexOrder = lazy(() => import("./pages/CreateFedexOrder"));
const Deposite = lazy(() => import("./pages/Deposite"));

//Admin
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard")
);
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue"));
const AdminFAQs = lazy(() => import("./pages/admin/AdminFAQs"));

function App() {
  const location = useLocation();
  const { user, loader } = useSelector((state) => state.auth);

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex">
        {location.pathname !== "/login" && <Header />}
        <div className="flex-grow">
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" replace />}
              />

              {/* Admin Protected Routes */}
              <Route element={<AdminProtectRoute />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-orders" element={<AdminOrders />} />
                <Route path="/admin-revenue" element={<AdminRevenue />} />
                <Route path="/admin-faqs" element={<AdminFAQs />} />
              </Route>

              {/* User Protected Routes */}
              <Route element={<ProtectRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/FAQs" element={<FAQs />} />
                <Route path="/createOrders" element={<CreateOrders />} />
                <Route path="/fedex-orders" element={<FedexOrderList />} />
                <Route
                  path="/create-fedex-order"
                  element={<CreateFedexOrder />}
                />
                <Route path="/Deposits" element={<Deposite />} />
                <Route path="/Addresses" element={<Addresses />} />
                <Route path="/CreateAddresses" element={<CreateAddresses />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
