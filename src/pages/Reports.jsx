import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaBoxes,
  FaTruck,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaCalendarDay,
  FaCalendarAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Reports() {
  const [productStock, setProductStock] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        api.get("/reports/product-stock"),
        api.get("/reports/supplier-products"),
        api.get("/reports/daily-transactions"),
        api.get("/reports/monthly-transactions"),
        api.get("/reports/low-stock"),
        api.get("/reports/stock-movements"),
      ]);

      const [
        productResult,
        supplierResult,
        dailyResult,
        monthlyResult,
        lowStockResult,
        movementResult,
      ] = results;

      if (productResult.status === "fulfilled") {
        setProductStock(
          productResult.value.data?.products ||
          productResult.value.data?.report ||
          productResult.value.data?.data ||
          []
        );
      }

      if (supplierResult.status === "fulfilled") {
        setSupplierProducts(
          supplierResult.value.data?.suppliers ||
          supplierResult.value.data?.report ||
          supplierResult.value.data?.data ||
          []
        );
      }

      if (dailyResult.status === "fulfilled") {
        setDailyTransactions(
          dailyResult.value.data?.transactions ||
          dailyResult.value.data?.report ||
          dailyResult.value.data?.data ||
          []
        );
      }

      if (monthlyResult.status === "fulfilled") {
        setMonthlyTransactions(
          monthlyResult.value.data?.transactions ||
          monthlyResult.value.data?.report ||
          monthlyResult.value.data?.data ||
          []
        );
      }

      if (lowStockResult.status === "fulfilled") {
        setLowStock(
          lowStockResult.value.data?.products ||
          lowStockResult.value.data?.report ||
          lowStockResult.value.data?.data ||
          []
        );
      }

      if (movementResult.status === "fulfilled") {
        setStockMovements(
          movementResult.value.data?.movements ||
          movementResult.value.data?.report ||
          movementResult.value.data?.data ||
          []
        );
      }

      const failed = results.filter(
        (result) => result.status === "rejected"
      );

      if (failed.length > 0) {
        console.log("Some reports failed:", failed);
      }

    } catch (error) {
      console.error("Reports Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const totalStock = productStock.reduce(
    (total, item) =>
      total +
      Number(
        item.currentStock ??
        item.stock ??
        item.quantity ??
        0
      ),
    0
  );

  const totalMovements = stockMovements.length;

  const totalLowStock = lowStock.length;

  const totalProducts = productStock.length;

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg">
              <FaChartBar />
            </div>

            <div>

              <p className="text-violet-600 text-sm font-bold uppercase tracking-wide">
                Analytics & Reports
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Reports
              </h1>

              <p className="text-slate-500 mt-1">
                View warehouse inventory and stock reports
              </p>

            </div>

          </div>

          <button
            onClick={loadReports}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-60"
          >
            <FaSyncAlt
              className={loading ? "animate-spin" : ""}
            />
            Refresh Reports
          </button>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <ReportCard
            title="Total Products"
            value={totalProducts}
            icon={<FaBoxes />}
            bg="bg-blue-50"
            text="text-blue-600"
          />

          <ReportCard
            title="Current Stock"
            value={totalStock}
            icon={<FaChartBar />}
            bg="bg-green-50"
            text="text-green-600"
          />

          <ReportCard
            title="Stock Movements"
            value={totalMovements}
            icon={<FaExchangeAlt />}
            bg="bg-violet-50"
            text="text-violet-600"
          />

          <ReportCard
            title="Low Stock Items"
            value={totalLowStock}
            icon={<FaExclamationTriangle />}
            bg="bg-orange-50"
            text="text-orange-600"
          />

        </div>

        {/* REPORT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

          <ReportBox
            icon={<FaBoxes />}
            title="Product-wise Stock"
            description="View current stock available for every product."
            count={productStock.length}
            color="blue"
          />

          <ReportBox
            icon={<FaTruck />}
            title="Supplier-wise Products"
            description="View products supplied by each supplier."
            count={supplierProducts.length}
            color="cyan"
          />

          <ReportBox
            icon={<FaCalendarDay />}
            title="Daily Transactions"
            description="Review today's stock transactions."
            count={dailyTransactions.length}
            color="green"
          />

          <ReportBox
            icon={<FaCalendarAlt />}
            title="Monthly Transactions"
            description="Review monthly stock transaction activity."
            count={monthlyTransactions.length}
            color="violet"
          />

          <ReportBox
            icon={<FaExclamationTriangle />}
            title="Low Stock Report"
            description="Products that need stock replenishment."
            count={lowStock.length}
            color="orange"
          />

          <ReportBox
            icon={<FaExchangeAlt />}
            title="Stock Movement Report"
            description="Complete stock movement history."
            count={stockMovements.length}
            color="indigo"
          />

        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">

          <div className="px-6 py-5 border-b flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <FaExclamationTriangle />
              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-800">
                  Low Stock Report
                </h2>

                <p className="text-sm text-slate-400">
                  Products requiring attention
                </p>

              </div>

            </div>

            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
              {lowStock.length} Items
            </span>

          </div>

          {loading ? (

            <div className="p-10 text-center text-slate-500">
              Loading report...
            </div>

          ) : lowStock.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-green-500 text-4xl mb-3">
                ✓
              </div>

              <p className="font-semibold text-slate-700">
                No low-stock products
              </p>

              <p className="text-sm text-slate-400 mt-1">
                All products have sufficient stock.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4">
                      Product
                    </th>

                    <th className="text-left px-6 py-4">
                      SKU
                    </th>

                    <th className="text-left px-6 py-4">
                      Stock
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {lowStock
                    .slice(0, 10)
                    .map((item, index) => {

                      const product =
                        item.product || item;

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
                          className="border-t hover:bg-orange-50"
                        >

                          <td className="px-6 py-4 font-semibold">
                            {product.productName ||
                              product.name ||
                              "N/A"}
                          </td>

                          <td className="px-6 py-4">
                            {product.skuCode ||
                              item.skuCode ||
                              "N/A"}
                          </td>

                          <td className="px-6 py-4">

                            <span className="font-bold text-orange-600">
                              {stock}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                              Low Stock
                            </span>

                          </td>

                        </tr>
                      );

                    })}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* PRODUCT STOCK */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b">

            <h2 className="text-lg font-bold text-slate-800">
              Product-wise Stock
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Current inventory available in warehouse
            </p>

          </div>

          {productStock.length === 0 ? (

            <div className="p-10 text-center text-slate-400">
              No product stock data available.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4">
                      Product
                    </th>

                    <th className="text-left px-6 py-4">
                      SKU
                    </th>

                    <th className="text-left px-6 py-4">
                      Stock
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {productStock
                    .slice(0, 15)
                    .map((item, index) => {

                      const product =
                        item.product || item;

                      return (
                        <tr
                          key={
                            product._id ||
                            item._id ||
                            index
                          }
                          className="border-t hover:bg-blue-50"
                        >

                          <td className="px-6 py-4 font-medium">
                            {product.productName ||
                              product.name ||
                              "N/A"}
                          </td>

                          <td className="px-6 py-4">
                            {product.skuCode ||
                              item.skuCode ||
                              "N/A"}
                          </td>

                          <td className="px-6 py-4 font-bold text-blue-600">
                            {item.currentStock ??
                              item.stock ??
                              item.quantity ??
                              0}
                          </td>

                        </tr>
                      );

                    })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

function ReportCard({
  title,
  value,
  icon,
  bg,
  text,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-xl ${bg} ${text} flex items-center justify-center text-xl`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

function ReportBox({
  icon,
  title,
  description,
  count,
  color,
}) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    cyan: "from-cyan-500 to-cyan-600",
    green: "from-green-500 to-green-600",
    violet: "from-violet-500 to-violet-600",
    orange: "from-orange-500 to-orange-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:-translate-y-1 hover:shadow-lg transition">

      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} text-white flex items-center justify-center text-xl mb-5`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-800">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 min-h-[40px]">
        {description}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t">

        <span className="text-sm text-slate-400">
          Records
        </span>

        <span className="font-bold text-slate-800">
          {count}
        </span>

      </div>

    </div>
  );
}

export default Reports;