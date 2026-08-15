import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";

import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/EditProduct";

import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";

import StockMovement from "./pages/StockMovement";
import StockLedger from "./pages/StockLedger";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= PRODUCTS ================= */}

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />


        

        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        {/* ================= CATEGORIES ================= */}

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        {/* ================= SUPPLIERS ================= */}

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        {/* ================= STOCK MOVEMENT ================= */}

        <Route
          path="/stock-movement"
          element={
            <ProtectedRoute>
              <StockMovement />
            </ProtectedRoute>
          }
        />

        {/* ================= STOCK LEDGER ================= */}

        <Route
          path="/stock-ledger"
          element={
            <ProtectedRoute>
              <StockLedger />
            </ProtectedRoute>
          }
        />

        <Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>

        {/* ================= UNKNOWN ROUTE ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;