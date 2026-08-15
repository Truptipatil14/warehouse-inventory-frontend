import { useEffect, useState } from "react";
import {
  FaSearch,
  FaBook,
  FaTimes,
  FaFilter,
  FaBoxes,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function StockLedger() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [search, setSearch] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(false);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      const response = await api.get("/products");

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // ==========================================
  // LOAD STOCK MOVEMENTS
  // ==========================================

  const fetchMovements = async () => {
    try {
      setLoadingMovements(true);

      const response = await api.get(
        "/stock-movements"
      );

      if (response.data.success) {
        setMovements(
          response.data.movements || []
        );
      }
    } catch (error) {
      console.error("MOVEMENT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load stock ledger"
      );
    } finally {
      setLoadingMovements(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchProducts();
    fetchMovements();
  }, []);

  // ==========================================
  // SEARCH + PRODUCT FILTER
  // ==========================================

  const filteredMovements = movements.filter(
    (movement) => {
      const searchText = search
        .trim()
        .toLowerCase();

      // ----------------------------------------
      // PRODUCT FILTER
      // ----------------------------------------

      if (selectedProduct) {
        const movementProductId =
          movement.product?._id ||
          movement.productId;

        if (
          String(movementProductId) !==
          String(selectedProduct)
        ) {
          return false;
        }
      }

      // ----------------------------------------
      // SEARCH
      // ----------------------------------------

      if (!searchText) {
        return true;
      }

      const productName =
        movement.product?.productName ||
        "";

      const skuCode =
        movement.product?.skuCode ||
        "";

      const movementType =
        movement.movementType || "";

      const referenceNumber =
        movement.referenceNumber || "";

      const remarks =
        movement.remarks || "";

      const performedBy =
        movement.performedBy?.name ||
        "";

      const date = movement.createdAt
        ? new Date(
            movement.createdAt
          ).toLocaleString()
        : "";

      return (
        productName
          .toLowerCase()
          .includes(searchText) ||

        skuCode
          .toLowerCase()
          .includes(searchText) ||

        movementType
          .toLowerCase()
          .includes(searchText) ||

        referenceNumber
          .toLowerCase()
          .includes(searchText) ||

        remarks
          .toLowerCase()
          .includes(searchText) ||

        performedBy
          .toLowerCase()
          .includes(searchText) ||

        date
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // FILTER PRODUCTS FOR DROPDOWN
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const text = search
        .trim()
        .toLowerCase();

      if (!text) return true;

      return (
        product.productName
          ?.toLowerCase()
          .includes(text) ||

        product.skuCode
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // ==========================================
  // SELECTED PRODUCT
  // ==========================================

  const selectedProductData = products.find(
    (product) =>
      String(product._id) ===
      String(selectedProduct)
  );


  {products.map(
  (product) => (
    <option
      key={product._id}
      value={product._id}
    >
      {product.productName} - {product.skuCode}
    </option>
  )
)}
  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSelectedProduct("");
  };

  // ==========================================
  // INCREASE MOVEMENT TYPES
  // ==========================================

  const increaseTypes = [
    "Purchase",
    "Return In",
    "Stock In",
    "Adjustment In",
  ];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
              <FaBook />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Stock Ledger
              </h1>

              <p className="text-slate-500 mt-1">
                Complete stock transaction history
              </p>

            </div>

          </div>

          <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">

            <div className="flex items-center gap-3">

              <FaBoxes className="text-blue-600" />

              <div>

                <p className="text-xs text-slate-400">
                  Transactions
                </p>

                <p className="font-bold text-slate-800">
                  {filteredMovements.length}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================
            FILTER CARD
        ================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2">

              <FaFilter className="text-blue-600" />

              <h2 className="font-bold text-slate-800">
                Search & Filter
              </h2>

            </div>

            {(search || selectedProduct) && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700"
              >
                <FaTimes />
                Clear Filters
              </button>
            )}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* SEARCH */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Search Ledger
              </label>

              <div className="relative">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Product, SKU, reference, remarks..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-10 py-3.5 text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center"
                  >
                    <FaTimes size={12} />
                  </button>
                )}

              </div>

            </div>

            {/* PRODUCT SELECT */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Select Product
              </label>

              <select
                value={selectedProduct}
                onChange={(e) =>
                  setSelectedProduct(
                    e.target.value
                  )
                }
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition cursor-pointer"
              >

                <option value="">
                  All Products
                </option>

                {loadingProducts ? (
                  <option disabled>
                    Loading products...
                  </option>
                ) : (
                  filteredProducts.map(
                    (product) => (
                      <option
                        key={product._id}
                        value={product._id}
                      >
                        {product.productName}
                        {" - "}
                        {product.skuCode}
                      </option>
                    )
                  )
                )}

              </select>

            </div>

          </div>

          {/* SEARCH RESULT INFO */}

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

            <p className="text-sm text-slate-500">

              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredMovements.length}
              </span>{" "}
              transaction
              {filteredMovements.length !== 1
                ? "s"
                : ""}

            </p>

            {search && (
              <p className="text-sm text-blue-600">
                Searching for:{" "}
                <span className="font-semibold">
                  "{search}"
                </span>
              </p>
            )}

          </div>

        </div>

        {/* ==================================
            CURRENT STOCK
        ================================== */}

        {selectedProductData && (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                  <FaBook size={24} />
                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Current Stock
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800">
                    {selectedProductData.currentStock ??
                      0}
                  </h2>

                  <p className="text-slate-500">
                    {selectedProductData.productName}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ==================================
            LEDGER TABLE
        ================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {loadingMovements ? (

            <div className="p-16 text-center">

              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-slate-500">
                Loading stock ledger...
              </p>

            </div>

          ) : filteredMovements.length === 0 ? (

            <div className="p-16 text-center">

              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">

                <FaBook className="text-2xl text-slate-300" />

              </div>

              <h3 className="font-bold text-slate-700">
                No transactions found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Try a different search or clear the filters.
              </p>

              {(search || selectedProduct) && (
                <button
                  onClick={clearFilters}
                  className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                >
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Movement
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Reference
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Remarks
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Performed By
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredMovements.map(
                    (movement) => {

                      const isIncrease =
                        increaseTypes.includes(
                          movement.movementType
                        );

                      return (

                        <tr
                          key={movement._id}
                          className="border-b border-slate-100 hover:bg-blue-50/40 transition"
                        >

                          {/* DATE */}

                          <td className="px-6 py-5 text-sm text-slate-600 whitespace-nowrap">

                            {movement.createdAt
                              ? new Date(
                                  movement.createdAt
                                ).toLocaleString()
                              : "N/A"}

                          </td>

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <div className="font-semibold text-slate-800">

                              {movement.product
                                ?.productName ||
                                "Unknown Product"}

                            </div>

                            <div className="text-sm text-slate-400 mt-1">

                              {movement.product
                                ?.skuCode ||
                                "No SKU"}

                            </div>

                          </td>

                          {/* MOVEMENT */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                                isIncrease
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >

                              {isIncrease ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}

                              {movement.movementType ||
                                "N/A"}

                            </span>

                          </td>

                          {/* QUANTITY */}

                          <td
                            className={`px-6 py-5 font-bold ${
                              isIncrease
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >

                            {isIncrease
                              ? "+"
                              : "-"}

                            {movement.quantity ?? 0}

                          </td>

                          {/* REFERENCE */}

                          <td className="px-6 py-5 text-slate-600">

                            {movement.referenceNumber ||
                              "N/A"}

                          </td>

                          {/* REMARKS */}

                          <td className="px-6 py-5 text-slate-600">

                            {movement.remarks ||
                              "N/A"}

                          </td>

                          {/* PERFORMED BY */}

                          <td className="px-6 py-5 text-slate-600">

                            {movement.performedBy
                              ?.name ||
                              "N/A"}

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default StockLedger;