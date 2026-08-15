import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBoxes,
  FaBarcode,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Products Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    return (
      product.productName
        ?.toLowerCase()
        .includes(text) ||
      product.skuCode
        ?.toLowerCase()
        .includes(text) ||
      product.barcode
        ?.toLowerCase()
        .includes(text)
    );
  });

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await api.delete(
        `/products/${id}`
      );

      if (response.data.success) {
        toast.success(
          "Product deleted successfully"
        );

        fetchProducts();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                <FaBoxes />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Products
                </h1>

                <p className="text-slate-500 mt-1">
                  Manage your warehouse products
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={() =>
              navigate("/products/add")
            }
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            <FaPlus />
            Add Product
          </button>

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <SummaryCard
            title="Total Products"
            value={products.length}
            icon={<FaBoxes />}
          />

          <SummaryCard
            title="Active Products"
            value={
              products.filter(
                (p) => p.status === "Active"
              ).length
            }
            icon="✓"
          />

          <SummaryCard
            title="Low / Out of Stock"
            value={
              products.filter(
                (p) =>
                  Number(p.currentStock ?? 0) <=
                  Number(p.minimumStock ?? 0)
              ).length
            }
            icon="!"
          />

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            <div className="relative w-full md:max-w-xl">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search by product name, SKU or barcode..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">

              <FaFilter />

              <span>
                Showing{" "}
                <strong className="text-slate-700">
                  {filteredProducts.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-700">
                  {products.length}
                </strong>{" "}
                products
              </span>

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <h2 className="text-lg font-bold text-slate-800">
              Product Inventory
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              View and manage all warehouse products
            </p>

          </div>

          {loading ? (

            <div className="p-16 text-center">

              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-slate-500">
                Loading products...
              </p>

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="p-16 text-center">

              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
                <FaBoxes />
              </div>

              <h3 className="font-semibold text-slate-700">
                No products found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search or add a new product.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      SKU / Barcode
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Supplier
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Stock
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {

                      const stock =
                        Number(
                          product.currentStock ?? 0
                        );

                      const minimum =
                        Number(
                          product.minimumStock ?? 0
                        );

                      const lowStock =
                        stock <= minimum;

                      return (

                        <tr
                          key={product._id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition"
                        >

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FaBoxes />
                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {product.productName}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  {product.unit || "Unit"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* SKU */}

                          <td className="px-6 py-5">

                            <p className="font-medium text-slate-700">
                              {product.skuCode || "N/A"}
                            </p>

                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <FaBarcode />
                              {product.barcode || "No barcode"}
                            </p>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-6 py-5">

                            <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium">
                              {product.category?.categoryName ||
                                product.category?.name ||
                                "N/A"}
                            </span>

                          </td>

                          {/* SUPPLIER */}

                          <td className="px-6 py-5 text-sm text-slate-600">

                            {product.supplier?.supplierName ||
                              product.supplier?.name ||
                              "N/A"}

                          </td>

                          {/* STOCK */}

                          <td className="px-6 py-5">

                            <div>

                              <p
                                className={`font-bold ${
                                  stock === 0
                                    ? "text-red-600"
                                    : lowStock
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {stock}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                Min: {minimum}
                              </p>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                product.status ===
                                "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >

                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>

                              {product.status ||
                                "Inactive"}

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-center gap-2">

                              <button
                                onClick={() =>
                                  navigate(
                                    `/products/edit/${product._id}`
                                  )
                                }
                                className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                                title="Edit Product"
                              >
                                <FaEdit />
                              </button>

                              <button
                                onClick={() =>
                                  deleteProduct(
                                    product._id
                                  )
                                }
                                className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition"
                                title="Delete Product"
                              >
                                <FaTrash />
                              </button>

                            </div>

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

/* ================= SUMMARY CARD ================= */

function SummaryCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {value}
          </h3>

        </div>

        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Products;