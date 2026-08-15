import { useEffect, useState } from "react";
import {
  FaBoxes,
  FaTags,
  FaTruck,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRupeeSign,
  FaExchangeAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [movements, setMovements] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ALL DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        api.get("/products"),
        api.get("/categories"),
        api.get("/suppliers"),
        api.get("/stock-movements"),
      ]);

      // ---------------- PRODUCTS ----------------

      if (results[0].status === "fulfilled") {
        const data = results[0].value.data;

        if (data.success) {
          setProducts(data.products || []);
        }
      }

      // ---------------- CATEGORIES ----------------

      if (results[1].status === "fulfilled") {
        const data = results[1].value.data;

        if (data.success) {
          setCategories(data.categories || []);
        }
      }

      // ---------------- SUPPLIERS ----------------

      if (results[2].status === "fulfilled") {
        const data = results[2].value.data;

        if (data.success) {
          setSuppliers(data.suppliers || []);
        }
      }

      // ---------------- STOCK MOVEMENTS ----------------

      if (results[3].status === "fulfilled") {
        const data = results[3].value.data;

        if (data.success) {
          setMovements(data.movements || []);
        }
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // PRODUCT STOCK HELPER
  // ==========================================

  const getStock = (product) => {
    return Number(
      product.currentStock ??
      product.stock ??
      product.quantity ??
      0
    );
  };

  // ==========================================
  // MINIMUM STOCK HELPER
  // ==========================================

  const getMinimumStock = (product) => {
    return Number(
      product.minimumStock ??
      product.minStock ??
      0
    );
  };

  // ==========================================
  // TOTAL PRODUCTS
  // ==========================================

  const totalProducts = products.length;

  // ==========================================
  // TOTAL CATEGORIES
  // ==========================================

  const totalCategories = categories.length;

  // ==========================================
  // TOTAL SUPPLIERS
  // ==========================================

  const totalSuppliers = suppliers.length;

  // ==========================================
  // LOW STOCK PRODUCTS
  // ==========================================

  const lowStockList = products.filter((product) => {
    const stock = getStock(product);
    const minimum = getMinimumStock(product);

    return stock > 0 && stock <= minimum;
  });

  const lowStockProducts = lowStockList.length;

  // ==========================================
  // OUT OF STOCK
  // ==========================================

  const outOfStockProducts = products.filter(
    (product) => getStock(product) <= 0
  ).length;

  // ==========================================
  // TOTAL STOCK VALUE
  // ==========================================

  const totalStockValue = products.reduce(
    (total, product) => {
      const stock = getStock(product);

      const price = Number(
        product.finalPrice ??
        product.price ??
        product.costPrice ??
        0
      );

      return total + stock * price;
    },
    0
  );

  // ==========================================
  // TODAY'S TRANSACTIONS
  // ==========================================

  const today = new Date();

  const todayTransactions = movements.filter(
    (movement) => {
      if (!movement.createdAt) return false;

      const movementDate = new Date(
        movement.createdAt
      );

      return (
        movementDate.getDate() === today.getDate() &&
        movementDate.getMonth() === today.getMonth() &&
        movementDate.getFullYear() ===
          today.getFullYear()
      );
    }
  ).length;

  // ==========================================
  // RECENT TRANSACTIONS
  // ==========================================

  const recentTransactions = [...movements]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar />

        <main className="ml-64 p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Loading warehouse information...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[1, 2, 3, 4, 5, 6, 7].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
                >
                  <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>

                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              )
            )}

          </div>

        </main>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Warehouse inventory overview
          </p>

        </div>

        {/* ======================================
            STATISTICS
        ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<FaBoxes />}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Total Categories"
            value={totalCategories}
            icon={<FaTags />}
            iconClass="bg-purple-100 text-purple-600"
          />

          <StatCard
            title="Total Suppliers"
            value={totalSuppliers}
            icon={<FaTruck />}
            iconClass="bg-orange-100 text-orange-600"
          />

          <StatCard
            title="Low Stock"
            value={lowStockProducts}
            icon={<FaExclamationTriangle />}
            iconClass="bg-yellow-100 text-yellow-600"
          />

          <StatCard
            title="Out of Stock"
            value={outOfStockProducts}
            icon={<FaTimesCircle />}
            iconClass="bg-red-100 text-red-600"
          />

          <StatCard
            title="Total Stock Value"
            value={`₹${totalStockValue.toLocaleString(
              "en-IN"
            )}`}
            icon={<FaRupeeSign />}
            iconClass="bg-green-100 text-green-600"
          />

          <StatCard
            title="Today's Transactions"
            value={todayTransactions}
            icon={<FaExchangeAlt />}
            iconClass="bg-cyan-100 text-cyan-600"
          />

        </div>

        {/* ======================================
            LOW STOCK + RECENT TRANSACTIONS
        ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LOW STOCK */}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold text-slate-800">
                Low Stock Products
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Products that need restocking
              </p>

            </div>

            {lowStockList.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-3 text-sm">
                        Product
                      </th>

                      <th className="text-left px-6 py-3 text-sm">
                        Stock
                      </th>

                      <th className="text-left px-6 py-3 text-sm">
                        Minimum
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {lowStockList.map(
                      (product) => (

                        <tr
                          key={product._id}
                          className="border-b hover:bg-slate-50"
                        >

                          <td className="px-6 py-4 font-medium text-slate-800">
                            {product.productName ||
                              "Unknown Product"}
                          </td>

                          <td className="px-6 py-4 text-yellow-600 font-bold">
                            {getStock(product)}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {getMinimumStock(product)}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="p-10 text-center">

                <FaExclamationTriangle className="mx-auto text-4xl text-green-400 mb-4" />

                <p className="font-semibold text-slate-700">
                  No low stock products
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  All products have sufficient stock 🎉
                </p>

              </div>

            )}

          </div>

          {/* RECENT TRANSACTIONS */}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold text-slate-800">
                Recent Transactions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest stock movements
              </p>

            </div>

            {recentTransactions.length > 0 ? (

              <div className="divide-y">

                {recentTransactions.map(
                  (movement) => (

                    <div
                      key={movement._id}
                      className="p-5 flex items-center justify-between hover:bg-slate-50 transition"
                    >

                      <div>

                        <p className="font-semibold text-slate-800">
                          {movement.product
                            ?.productName ||
                            "Unknown Product"}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {movement.movementType ||
                            "Stock Movement"}
                        </p>

                      </div>

                      <div className="text-right">

                        <p
                          className={`font-bold ${
                            movement.movementType ===
                              "Purchase" ||
                            movement.movementType ===
                              "Return In"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {movement.movementType ===
                            "Purchase" ||
                          movement.movementType ===
                            "Return In"
                            ? "+"
                            : "-"}
                          {movement.quantity || 0}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {movement.createdAt
                            ? new Date(
                                movement.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="p-10 text-center">

                <FaExchangeAlt className="mx-auto text-4xl text-slate-300 mb-4" />

                <p className="font-semibold text-slate-600">
                  No recent transactions
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Stock movements will appear here
                </p>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`p-4 rounded-2xl text-xl group-hover:scale-110 transition-transform ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;