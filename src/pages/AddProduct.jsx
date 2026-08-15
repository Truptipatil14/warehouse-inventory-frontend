import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    skuCode: "",
    barcode: "",
    category: "",
    supplier: "",
    purchasePrice: "",
    sellingPrice: "",
    minimumStock: "",
    unit: "Piece",
    status: "Active",
  });

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");

      if (response.data.success) {
        setSuppliers(response.data.suppliers || []);
      }
    } catch (error) {
      toast.error("Failed to load suppliers");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.skuCode ||
      !formData.category ||
      !formData.supplier ||
      !formData.purchasePrice ||
      !formData.sellingPrice ||
      !formData.minimumStock
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (
      Number(formData.purchasePrice) < 0 ||
      Number(formData.sellingPrice) < 0 ||
      Number(formData.minimumStock) < 0
    ) {
      toast.error("Values cannot be negative");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/products",
        {
          ...formData,
          purchasePrice: Number(formData.purchasePrice),
          sellingPrice: Number(formData.sellingPrice),
          minimumStock: Number(formData.minimumStock),
        }
      );

      if (response.data.success) {
        toast.success("Product created successfully!");

        navigate("/products");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Add Product
          </h1>

          <p className="text-slate-500 mt-1">
            Add a new product to your inventory
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Product Name + SKU */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

              <InputField
                label="SKU Code"
                name="skuCode"
                value={formData.skuCode}
                onChange={handleChange}
                placeholder="Example: WM-001"
                required
              />

            </div>

            {/* Barcode */}

            <InputField
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter barcode"
            />

            {/* Category + Supplier */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Supplier *
                </label>

                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Supplier
                  </option>

                  {suppliers.map((supplier) => (
                    <option
                      key={supplier._id}
                      value={supplier._id}
                    >
                      {supplier.supplierName ||
                        supplier.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Prices */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="Enter purchase price"
                required
              />

              <InputField
                label="Selling Price"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Enter selling price"
                required
              />

            </div>

            {/* Minimum Stock + Unit */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                label="Minimum Stock"
                name="minimumStock"
                type="number"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="Example: 10"
                required
              />

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                >
                  <option value="Piece">Piece</option>
                  <option value="Kg">Kg</option>
                  <option value="Gram">Gram</option>
                  <option value="Liter">Liter</option>
                  <option value="Box">Box</option>
                  <option value="Packet">Packet</option>
                </select>
              </div>

            </div>

            {/* Status */}

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-4 pt-4 border-t">

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save Product"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-slate-700">
        {label} {required && "*"}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default AddProduct;