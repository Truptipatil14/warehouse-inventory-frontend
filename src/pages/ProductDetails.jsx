import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);

      if (response.data.success) {
        setProduct(
          response.data.product || response.data.data
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <p className="text-slate-500">
            Loading product...
          </p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Sidebar />

        <main className="ml-64 p-8">
          <p className="text-red-600">
            Product not found.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft />
          Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="flex justify-between items-start mb-8">

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {product.productName}
              </h1>

              <p className="text-slate-500 mt-2">
                SKU: {product.skuCode}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                product.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.status}
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Info
              label="Product Name"
              value={product.productName}
            />

            <Info
              label="SKU Code"
              value={product.skuCode}
            />

            <Info
              label="Barcode"
              value={product.barcode || "N/A"}
            />

            <Info
              label="Category"
              value={
                product.category?.name ||
                product.category?.categoryName ||
                "N/A"
              }
            />

            <Info
              label="Supplier"
              value={
                product.supplier?.supplierName ||
                product.supplier?.name ||
                "N/A"
              }
            />

            <Info
              label="Purchase Price"
              value={`₹ ${product.purchasePrice ?? 0}`}
            />

            <Info
              label="Selling Price"
              value={`₹ ${product.sellingPrice ?? 0}`}
            />

            <Info
              label="Minimum Stock"
              value={product.minimumStock ?? 0}
            />

            <Info
              label="Current Stock"
              value={product.currentStock ?? 0}
            />

            <Info
              label="Unit"
              value={product.unit || "Piece"}
            />

          </div>

          <div className="mt-8 pt-6 border-t">

            <p className="text-sm text-slate-500">
              Current Stock is controlled through Stock
              Movement transactions.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <p className="text-sm text-slate-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default ProductDetails;