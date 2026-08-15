import { useEffect, useState } from "react";
import {
  FaBoxes,
  FaTags,
  FaTruck,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRupeeSign,
  FaExchangeAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStockValue: 0,
    todayTransactions: 0,
    lowStockList: [],
    recentTransactions: [],
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        api.get("/products"),
        api.get("/categories"),
        api.get("/suppliers"),
        api.get("/stock-movements"),
        api.get("/reports/low-stock"),
      ]);

      // ==========================================
      // PRODUCTS
      // ==========================================

      let products = [];

      if (results[0].status === "fulfilled") {
        products =
          results[0].value.data?.products ||
          results[0].value.data?.data ||
          [];
      }

      // ==========================================
      // CATEGORIES
      // ==========================================

      let categories = [];

      if (results[1].status === "fulfilled") {
        categories =
          results[1].value.data?.categories ||
          results[1].value.data?.data ||
          [];
      }

      // ==========================================
      // SUPPLIERS
      // ==========================================

      let suppliers = [];

      if (results[2].status === "fulfilled") {
        suppliers =
          results[2].value.data?.suppliers ||
          results[2].value.data?.data ||
          [];
      }

      // ==========================================
      // STOCK MOVEMENTS
      // ==========================================

      let movements = [];

      if (results[3].status === "fulfilled") {
        movements =
          results[3].value.data?.movements ||
          results[3].value.data?.data ||
          [];
      }

      // ==========================================
      // LOW STOCK
      // IMPORTANT:
      // Same API used by Reports.jsx
      // ==========================================

      let lowStockProducts = [];

      if (results[4].status === "fulfilled") {
        lowStockProducts =
          results[4].value.data?.products ||
          results[4].value.data?.report ||
          results[4].value.data?.data ||
          [];
      }

      // ==========================================
      // OUT OF STOCK
      // ==========================================

      const outOfStockProducts = products.filter(
        (product) => {
          const stock = Number(
            product.currentStock ??
              product.stock ??
              product.quantity ??
              0
          );

          return stock === 0;
        }
      );

      // ==========================================
      // TOTAL STOCK VALUE
      // ==========================================

      const totalStockValue = products.reduce(
        (total, product) => {
          const stock = Number(
            product.currentStock ??
              product.stock ??
              product.quantity ??
              0
          );

          const price = Number(
            product.price ?? 0
          );

          return total + stock * price;
        },
        0
      );

      // ==========================================
      // TODAY'S TRANSACTIONS
      // ==========================================

      const today = new Date();

      const todayTransactions =
        movements.filter((movement) => {
          if (!movement.createdAt) return false;

          const movementDate = new Date(
            movement.createdAt
          );

          return (
            movementDate.getDate() ===
              today.getDate() &&
            movementDate.getMonth() ===
              today.getMonth() &&
            movementDate.getFullYear() ===
              today.getFullYear()
          );
        });

      // ==========================================
      // RECENT TRANSACTIONS
      // ==========================================

      const recentTransactions = movements
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 5);

      // ==========================================
      // SET DASHBOARD STATS
      // ==========================================

      setStats({
        totalProducts: products.length,

        totalCategories:
          categories.length,

        totalSuppliers:
          suppliers.length,

        // IMPORTANT:
        // Reports मधून exact low stock count
        lowStockProducts:
          lowStockProducts.length,

        outOfStockProducts:
          outOfStockProducts.length,

        totalStockValue,

        todayTransactions:
          todayTransactions.length,

        lowStockList:
          lowStockProducts,

        recentTransactions,
      });

      // ==========================================
      // CHECK FAILED API REQUESTS
      // ==========================================

      const failedRequests = results.filter(
        (result) =>
          result.status === "rejected"
      );

      if (failedRequests.length > 0) {
        console.log(
          "Some dashboard APIs failed:",
          failedRequests
        );
      }

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar />

        <main className="ml-64 p-8">

          <div className="flex items-center justify-center min-h-[70vh]">

            <div className="text-center">

              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-slate-500 font-medium">
                Loading dashboard...
              </p>

            </div>

          </div>

        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">
              Warehouse Management
            </p>

            <h1 className="text-3xl font-bold text-slate-800 mt-1">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Warehouse inventory overview
            </p>

          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >

            <FaSyncAlt
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Dashboard

          </button>

        </div>

        {/* =====================================
            STATISTICS CARDS
        ===================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<FaBoxes />}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Total Categories"
            value={stats.totalCategories}
            icon={<FaTags />}
            iconClass="bg-purple-100 text-purple-600"
          />

          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers}
            icon={<FaTruck />}
            iconClass="bg-orange-100 text-orange-600"
          />

          <StatCard
            title="Low Stock"
            value={stats.lowStockProducts}
            icon={<FaExclamationTriangle />}
            iconClass="bg-yellow-100 text-yellow-600"
          />

          <StatCard
            title="Out of Stock"
            value={stats.outOfStockProducts}
            icon={<FaTimesCircle />}
            iconClass="bg-red-100 text-red-600"
          />

          <StatCard
            title="Total Stock Value"
            value={`₹${Number(
              stats.totalStockValue
            ).toLocaleString("en-IN")}`}
            icon={<FaRupeeSign />}
            iconClass="bg-green-100 text-green-600"
          />

          <StatCard
            title="Today's Transactions"
            value={stats.todayTransactions}
            icon={<FaExchangeAlt />}
            iconClass="bg-cyan-100 text-cyan-600"
          />

        </div>

        {/* =====================================
            LOW STOCK + RECENT TRANSACTIONS
        ===================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ===================================
              LOW STOCK
          =================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <FaExclamationTriangle />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Low Stock Products
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Products that need restocking
                  </p>

                </div>

              </div>

              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                {stats.lowStockProducts}
              </span>

            </div>

            {stats.lowStockList.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-3 text-xs uppercase text-slate-500">
                        Product
                      </th>

                      <th className="text-left px-6 py-3 text-xs uppercase text-slate-500">
                        Stock
                      </th>

                      <th className="text-left px-6 py-3 text-xs uppercase text-slate-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {stats.lowStockList
                      .slice(0, 5)
                      .map(
                        (item, index) => {

                          const product =
                            item.product ||
                            item;

                          const stock =
                            item.currentStock ??
                            item.stock ??
                            item.quantity ??
                            0;

                          return (
                            <tr
                              key={
                                product._id ||
                                item._id ||
                                index
                              }
                              className="border-t hover:bg-yellow-50 transition"
                            >

                              <td className="px-6 py-4">

                                <p className="font-semibold text-slate-800">
                                  {product.productName ||
                                    product.name ||
                                    "Unknown Product"}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  {product.skuCode ||
                                    item.skuCode ||
                                    "No SKU"}
                                </p>

                              </td>

                              <td className="px-6 py-4">

                                <span className="font-bold text-yellow-600">
                                  {stock}
                                </span>

                              </td>

                              <td className="px-6 py-4">

                                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                  Low Stock
                                </span>

                              </td>

                            </tr>
                          );
                        }
                      )}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="p-10 text-center">

                <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>

                <p className="font-semibold text-slate-700">
                  No low stock products
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  All products have sufficient stock.
                </p>

              </div>

            )}

          </div>

          {/* ===================================
              RECENT TRANSACTIONS
          =================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <FaExchangeAlt />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Recent Transactions
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Latest stock movements
                  </p>

                </div>

              </div>

            </div>

            {stats.recentTransactions.length > 0 ? (

              <div className="divide-y">

                {stats.recentTransactions.map(
                  (movement, index) => {

                    const increaseTypes = [
                      "Purchase",
                      "Return In",
                    ];

                    const isIncrease =
                      increaseTypes.includes(
                        movement.movementType
                      );

                    return (
                      <div
                        key={
                          movement._id ||
                          index
                        }
                        className="p-5 flex items-center justify-between hover:bg-slate-50 transition"
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isIncrease
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            <FaExchangeAlt />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {movement.product
                                ?.productName ||
                                "Unknown Product"}
                            </p>

                            <p className="text-sm text-slate-500">
                              {movement.movementType ||
                                "Stock Movement"}
                            </p>

                          </div>

                        </div>

                        <div className="text-right">

                          <p
                            className={`font-bold ${
                              isIncrease
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {isIncrease
                              ? "+"
                              : "-"}
                            {movement.quantity ??
                              0}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {movement.createdAt
                              ? new Date(
                                  movement.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="p-10 text-center">

                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <FaExchangeAlt />
                </div>

                <p className="font-semibold text-slate-700">
                  No recent transactions
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Stock movements will appear here.
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 font-medium">
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