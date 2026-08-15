import { useEffect, useState } from "react";

import {
  FaPlus,
  FaSearch,
  FaTruck,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    supplierName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    gstNumber: "",
    address: "",
    status: "Active",
  });

  // =========================
  // FETCH SUPPLIERS
  // =========================
  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/suppliers");

      if (response.data.success) {
        setSuppliers(response.data.suppliers || []);
      }
    } catch (error) {
      console.error("Supplier Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load suppliers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // =========================
  // OPEN ADD FORM
  // =========================
  const openAddForm = () => {
    setEditingId(null);

    setForm({
      supplierName: "",
      contactPerson: "",
      mobile: "",
      email: "",
      gstNumber: "",
      address: "",
      status: "Active",
    });

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================
  const openEditForm = (supplier) => {
    setEditingId(supplier._id);

    setForm({
      supplierName: supplier.supplierName || "",
      contactPerson: supplier.contactPerson || "",
      mobile: supplier.mobile || "",
      email: supplier.email || "",
      gstNumber: supplier.gstNumber || "",
      address: supplier.address || "",
      status: supplier.status || "Active",
    });

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.supplierName.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    if (!form.contactPerson.trim()) {
      toast.error("Contact person is required");
      return;
    }

    if (!form.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.address.trim()) {
      toast.error("Address is required");
      return;
    }

    try {
      let response;

      if (editingId) {
        // UPDATE
        response = await api.put(
          `/suppliers/${editingId}`,
          form
        );
      } else {
        // CREATE
        response = await api.post(
          "/suppliers",
          form
        );
      }

      if (response.data.success) {
        toast.success(
          editingId
            ? "Supplier updated successfully"
            : "Supplier created successfully"
        );

        closeForm();

        await fetchSuppliers();
      }
    } catch (error) {
      console.error("Supplier Save Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // =========================
  // DELETE SUPPLIER
  // =========================
  const deleteSupplier = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await api.delete(
        `/suppliers/${id}`
      );

      if (response.data.success) {
        toast.success(
          "Supplier deleted successfully"
        );

        fetchSuppliers();
      }
    } catch (error) {
      console.error("Delete Supplier Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete supplier"
      );
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredSuppliers = suppliers.filter(
    (supplier) => {
      const text = search.toLowerCase();

      const name = (
        supplier.supplierName || ""
      ).toLowerCase();

      const contact = (
        supplier.contactPerson || ""
      ).toLowerCase();

      const email = (
        supplier.email || ""
      ).toLowerCase();

      const mobile = (
        supplier.mobile || ""
      ).toLowerCase();

      const gst = (
        supplier.gstNumber || ""
      ).toLowerCase();

      return (
        name.includes(text) ||
        contact.includes(text) ||
        email.includes(text) ||
        mobile.includes(text) ||
        gst.includes(text)
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <main className="ml-64 p-8">

  {/* BACK BUTTON */}

  <button
    type="button"
    onClick={() => window.history.back()}
    className="mb-6 flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-slate-600 font-semibold shadow-sm hover:bg-slate-50 hover:text-cyan-600 transition"
  >
    <FaArrowLeft />
    Back
  </button>

  {/* =========================
      HEADER
  ========================= */}

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl shadow-lg">
              <FaTruck />
            </div>

            <div>

              <p className="text-cyan-600 text-sm font-semibold">
                SUPPLIER MANAGEMENT
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Suppliers
              </h1>

              <p className="text-slate-500">
                Manage warehouse suppliers
              </p>

            </div>

          </div>


          

          {/* ADD SUPPLIER BUTTON */}

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            <FaPlus />
            Add Supplier
          </button>

        </div>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-2xl p-5 shadow-sm border">

            <p className="text-slate-500">
              Total Suppliers
            </p>

            <h2 className="text-3xl font-bold text-cyan-600 mt-2">
              {suppliers.length}
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">

            <p className="text-slate-500">
              Active Suppliers
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {
                suppliers.filter(
                  (s) => s.status === "Active"
                ).length
              }
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">

            <p className="text-slate-500">
              Inactive Suppliers
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {
                suppliers.filter(
                  (s) => s.status !== "Active"
                ).length
              }
            </h2>

          </div>

        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border">

          <div className="relative max-w-xl">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search supplier, mobile, email or GST..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          {loading ? (

            <div className="p-12 text-center text-slate-500">
              Loading suppliers...
            </div>

          ) : filteredSuppliers.length === 0 ? (

            <div className="p-12 text-center">

              <FaTruck className="mx-auto text-4xl text-cyan-400 mb-3" />

              <p className="text-slate-500">
                No suppliers found
              </p>

              <button
                onClick={openAddForm}
                className="mt-4 bg-cyan-500 text-white px-5 py-2 rounded-lg"
              >
                Add First Supplier
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4">
                      Supplier
                    </th>

                    <th className="text-left px-6 py-4">
                      Contact Person
                    </th>

                    <th className="text-left px-6 py-4">
                      Mobile
                    </th>

                    <th className="text-left px-6 py-4">
                      Email
                    </th>

                    <th className="text-left px-6 py-4">
                      GST Number
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                    <th className="text-center px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSuppliers.map(
                    (supplier) => (

                    <tr
                      key={supplier._id}
                      className="border-t hover:bg-cyan-50"
                    >

                      <td className="px-6 py-4 font-semibold">
                        {supplier.supplierName ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {supplier.contactPerson ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {supplier.mobile ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {supplier.email ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        {supplier.gstNumber ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            supplier.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {supplier.status ||
                            "Inactive"}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                supplier
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSupplier(
                                supplier._id
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

       {/* =========================
    ADD / EDIT MODAL
========================= */}

{showForm && (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

      {/* MODAL HEADER */}

      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
            <FaTruck className="text-xl" />
          </div>

          <div>

            <h2 className="text-xl font-bold">
              {editingId ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <p className="text-blue-100 text-sm">
              {editingId
                ? "Update supplier details"
                : "Enter new supplier details"}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={closeForm}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30"
        >
          <FaTimes />
        </button>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="p-7"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


          {/* =========================
              SUPPLIER NAME
          ========================= */}

          <div className="md:col-span-2">

            <label className="block mb-2 font-semibold text-slate-700">
              Supplier Name *
            </label>

            <input
              type="text"
              name="supplierName"
              value={form.supplierName}
              onChange={handleChange}
              placeholder="ABC Enterprises"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />

          </div>


          {/* =========================
              CONTACT PERSON
          ========================= */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">
              Contact Person *
            </label>

            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              placeholder="Rahul Patil"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />

          </div>


          {/* =========================
              MOBILE
          ========================= */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">
              Mobile *
            </label>

            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="9876543210"
              required
              maxLength="10"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />

          </div>


          {/* =========================
              EMAIL
          ========================= */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="supplier@gmail.com"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />

          </div>


          {/* =========================
              GST NUMBER
          ========================= */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">
              GST Number
            </label>

            <input
              type="text"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 uppercase"
            />

          </div>


          {/* =========================
              STATUS
          ========================= */}

          <div>

            <label className="block mb-2 font-semibold text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* =========================
              ADDRESS
          ========================= */}

          <div className="md:col-span-2">

            <label className="block mb-2 font-semibold text-slate-700">
              Address *
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="4"
              placeholder="Enter complete supplier address"
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 resize-none"
            />

          </div>

        </div>


        {/* =========================
            BUTTONS
        ========================= */}

        <div className="flex gap-3 mt-7">

          {/* CANCEL */}

          <button
            type="button"
            onClick={closeForm}
            className="flex-1 border border-slate-300 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span className="flex items-center justify-center gap-2">
              <FaTimes />
              Cancel
            </span>
          </button>


          {/* SAVE / UPDATE */}

          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"
          >

            <FaSave />

            {editingId
              ? "Update Supplier"
              : "Save Supplier"}

          </button>

        </div>

      </form>

    </div>

  </div>
)}

</main>

</div>
);
}

export default Suppliers;