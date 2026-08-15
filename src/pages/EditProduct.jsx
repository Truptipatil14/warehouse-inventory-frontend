import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [productResponse, categoryResponse, supplierResponse] =
        await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
          api.get("/suppliers"),
        ]);

      const product =
        productResponse.data.product ||
        productResponse.data.data;

      setCategories(categoryResponse.data.categories || []);
      setSuppliers(supplierResponse.data.suppliers || []);

      if (!product) {
        toast.error("Product not found");
        navigate("/products");
        return;
      }

      setFormData({
        productName: product.productName || "",
        skuCode: product.skuCode || "",
        barcode: product.barcode || "",
        category:
          product.category?._id ||
          product.category ||
          "",
        supplier:
          product.supplier?._id ||
          product.supplier ||
          "",
        purchasePrice: product.purchasePrice ?? "",
        sellingPrice: product.sellingPrice ?? "",
        minimumStock: product.minimumStock ?? "",
        unit: product.unit || "Piece",
        status: product.status || "Active",
      });
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
      !formData.supplier
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
      setSaving(true);

      const response = await api.put(
        `/products/${id}`,
        {
          productName: formData.productName,
          skuCode: formData.skuCode,
          barcode: formData.barcode,
          category: formData.category,
          supplier: formData.supplier,
          purchasePrice: Number(formData.purchasePrice),
          sellingPrice: Number(formData.sellingPrice),
          minimumStock: Number(formData.minimumStock),
          unit: formData.unit,
          status: formData.status,
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/products");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Edit Product
          </h1>

          <p className="text-slate-500 mt-1">
            Update product information
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />

              <Field
                label="SKU Code"
                name="skuCode"
                value={formData.skuCode}
                onChange={handleChange}
                required
              />

            </div>

            <Field
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categories}
                optionLabel="name"
              />

              <Select
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                options={suppliers}
                optionLabel="supplierName"
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
              />

              <Field
                label="Selling Price"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field
                label="Minimum Stock"
                name="minimumStock"
                type="number"
                value={formData.minimumStock}
                onChange={handleChange}
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

            <div className="flex justify-end gap-4 pt-5 border-t">

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-6 py-3 border rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Product"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
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
        min={type === "number" ? "0" : undefined}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  optionLabel,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-slate-700">
        {label} *
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option[optionLabel] ||
              option.name ||
              option.supplierName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EditProduct;