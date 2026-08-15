import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaExchangeAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function StockMovement() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    product: "",
    movementType: "Purchase",
    quantity: "",
    referenceNumber: "",
    remarks: "",
  });

  // =========================
  // LOAD PRODUCTS + MOVEMENTS
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [movementResponse, productResponse] =
        await Promise.all([
          api.get("/stock-movements"),
          api.get("/products"),
        ]);

      if (movementResponse.data.success) {
        setMovements(
          movementResponse.data.movements || []
        );
      }

      if (productResponse.data.success) {
        setProducts(
          productResponse.data.products || []
        );
      }

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load stock data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // OPEN FORM
  // =========================

  const openForm = () => {
    setFormData({
      product: "",
      movementType: "Purchase",
      quantity: "",
      referenceNumber: "",
      remarks: "",
    });

    setShowForm(true);
  };

  // =========================
  // CREATE MOVEMENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product) {
      toast.error("Please select a product");
      return;
    }

    if (
      !formData.quantity ||
      Number(formData.quantity) <= 0
    ) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/stock-movements",
        {
          product: formData.product,
          movementType: formData.movementType,
          quantity: Number(formData.quantity),
          referenceNumber:
            formData.referenceNumber,
          remarks: formData.remarks,
        }
      );

      if (response.data.success) {
        toast.success(
          "Stock movement created successfully"
        );

        setShowForm(false);

        setFormData({
          product: "",
          movementType: "Purchase",
          quantity: "",
          referenceNumber: "",
          remarks: "",
        });

        fetchData();
      }

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create stock movement"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredMovements = movements.filter(
    (movement) => {
      const text = search.toLowerCase();

      return (
        movement.product?.productName
          ?.toLowerCase()
          .includes(text) ||
        movement.product?.skuCode
          ?.toLowerCase()
          .includes(text) ||
        movement.movementType
          ?.toLowerCase()
          .includes(text) ||
        movement.referenceNumber
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Stock Movement
            </h1>

            <p className="text-slate-500 mt-1">
              Manage all inventory stock transactions
            </p>
          </div>

          <button
            onClick={openForm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            <FaPlus />
            New Movement
          </button>

        </div>

        {/* SEARCH */}

        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <div className="relative max-w-md">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search product, SKU, type..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* FORM */}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <FaExchangeAlt />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Create Stock Movement
                </h2>

                <p className="text-sm text-slate-500">
                  Stock will be updated through this transaction
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* PRODUCT */}

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Product *
                </label>

                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                >

                  <option value="">
                    Select Product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product._id}
                      value={product._id}
                    >
                      {product.productName} -{" "}
                      {product.skuCode}
                    </option>
                  ))}

                </select>

              </div>

              {/* MOVEMENT TYPE */}

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Movement Type *
                </label>

                <select
                  name="movementType"
                  value={formData.movementType}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                >

                  <option value="Purchase">
                    Purchase
                  </option>

                  <option value="Sale">
                    Sale
                  </option>

                  <option value="Return In">
                    Return In
                  </option>

                  <option value="Return Out">
                    Return Out
                  </option>

                  <option value="Stock Adjustment">
                    Stock Adjustment
                  </option>

                  <option value="Damaged Stock">
                    Damaged Stock
                  </option>

                </select>

              </div>

              {/* QUANTITY */}

              <div>

                <label className="block mb-2 font-medium text-slate-700">
                  Quantity *
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="Enter quantity"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                />

              </div>

              {/* REFERENCE */}

              <div>

                <label className="block mb-2 font-medium text-slate-700">
                  Reference Number
                </label>

                <input
                  type="text"
                  name="referenceNumber"
                  value={
                    formData.referenceNumber
                  }
                  onChange={handleChange}
                  placeholder="Example: PO-001"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                />

              </div>

              {/* REMARKS */}

              <div>

                <label className="block mb-2 font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter remarks"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="px-5 py-3 border rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Movement"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* MOVEMENT TABLE */}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {loading ? (
            <div className="p-10 text-center">
              Loading stock movements...
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No stock movements found.
            </div>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4">
                      Product
                    </th>

                    <th className="text-left px-6 py-4">
                      Type
                    </th>

                    <th className="text-left px-6 py-4">
                      Quantity
                    </th>

                    <th className="text-left px-6 py-4">
                      Reference
                    </th>

                    <th className="text-left px-6 py-4">
                      Performed By
                    </th>

                    <th className="text-left px-6 py-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredMovements.map(
                    (movement) => (

                      <tr
                        key={movement._id}
                        className="border-b hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <div className="font-medium">
                            {
                              movement.product
                                ?.productName
                            }
                          </div>

                          <div className="text-sm text-slate-500">
                            {
                              movement.product
                                ?.skuCode
                            }
                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                            {movement.movementType}
                          </span>

                        </td>

                        <td className="px-6 py-4 font-semibold">
                          {movement.quantity}
                        </td>

                        <td className="px-6 py-4">
                          {movement.referenceNumber ||
                            "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          {movement.performedBy?.name ||
                            "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {movement.createdAt
                            ? new Date(
                                movement.createdAt
                              ).toLocaleString()
                            : "N/A"}
                        </td>

                      </tr>

                    )
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

export default StockMovement;