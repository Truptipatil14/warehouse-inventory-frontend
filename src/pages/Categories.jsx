import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaTags,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  // ==============================
  // FETCH CATEGORIES
  // ==============================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories");

      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error("FETCH CATEGORY ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==============================
  // OPEN ADD FORM
  // ==============================

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      status: "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const openEditForm = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "Active",
    });

    setShowForm(true);
  };

  // ==============================
  // CLOSE FORM
  // ==============================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      status: "Active",
    });
  };

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // SUBMIT FORM
  // ==============================


     
       
    const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("SUBMIT CLICKED");
  console.log("FORM DATA:", form);
  console.log("EDITING ID:", editingId);

  if (!form.name.trim()) {
    toast.error("Category name is required");
    return;
  }

  try {
    let response;

    if (editingId) {
      console.log("UPDATING CATEGORY...");

      response = await api.put(
        `/categories/${editingId}`,
        form
      );
    } else {
      console.log("ADDING CATEGORY...");

      response = await api.post(
        "/categories",
        form
      );
    }

    console.log("API RESPONSE:", response.data);

    if (response.data.success) {
      toast.success(
        editingId
          ? "Category updated successfully! ✅"
          : "Category added successfully! ✅"
      );

      closeForm();
      await fetchCategories();
    } else {
      toast.error(
        response.data.message || "Operation failed"
      );
    }

  } catch (error) {
    console.error("CATEGORY ERROR:", error);
    console.error("ERROR RESPONSE:", error.response?.data);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }
};

  // ==============================
  // DELETE CATEGORY
  // ==============================

  


  // ==============================
  // SEARCH
  // ==============================

  const filteredCategories = categories.filter(
    (category) => {
      const text = search.toLowerCase();

      return (
        category.name
          ?.toLowerCase()
          .includes(text) ||
        category.description
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // ==============================
  // JSX
  // ==============================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main className="ml-64 min-h-screen p-8">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
              <FaTags />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Categories
              </h1>

              <p className="text-slate-500 mt-1">
                Organize and manage your warehouse categories
              </p>

            </div>

          </div>

          {/* ADD CATEGORY */}

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
          >
            <FaPlus />
            Add Category
          </button>

        </div>

        {/* ==============================
            SEARCH
        ============================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

          <div className="relative max-w-xl">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-800 outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
            />

          </div>

        </div>

        {/* ==============================
            CATEGORY TABLE
        ============================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <h2 className="text-lg font-bold text-slate-800">
              Category List
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {filteredCategories.length} categories found
            </p>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="p-16 text-center">

              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-slate-500">
                Loading categories...
              </p>

            </div>

          ) : filteredCategories.length === 0 ? (

            /* EMPTY */

            <div className="p-16 text-center">

              <FaTags className="mx-auto text-5xl text-slate-300 mb-4" />

              <p className="font-bold text-slate-600">
                No categories found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Click "Add Category" to create one.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Description
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCategories.map(
                    (category) => (

                      <tr
                        key={category._id}
                        className="border-t border-slate-100 hover:bg-purple-50/40 transition"
                      >

                        {/* CATEGORY */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                              <FaTags />
                            </div>

                            <span className="font-bold text-slate-800">
                              {category.name}
                            </span>

                          </div>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="px-6 py-5 text-slate-500">
                          {category.description ||
                            "No description"}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                              category.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {category.status}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-center gap-2">

                            {/* EDIT */}

                           <button
  type="button"
  onClick={() => {
    console.log("EDIT CLICKED:", category);
    openEditForm(category);
  }}
  className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition cursor-pointer"
>
  <FaEdit />
</button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteCategory(
                                  category._id
                                )
                              }
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all duration-200"
                              title="Delete Category"
                            >
                              <FaTrash />
                            </button>

                          </div>

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

      {/* ==================================================
          ADD / EDIT CATEGORY MODAL
      ================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

          {/* MODAL */}

          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* ==============================
                MODAL HEADER
            ============================== */}

            <div className="shrink-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-5 text-white">

              <div className="flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">

                      <FaTags />

                    </div>

                    <h2 className="text-xl font-bold">
                      {editingId
                        ? "Edit Category"
                        : "Add New Category"}
                    </h2>

                  </div>

                  <p className="text-purple-100 text-sm mt-2">
                    Enter category information below
                  </p>

                </div>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                  title="Close"
                >
                  <FaTimes />
                </button>

              </div>

            </div>

            {/* ==============================
                SCROLLABLE FORM AREA
            ============================== */}

            <div className="overflow-y-auto">

              <form
                onSubmit={handleSubmit}
                className="p-6"
              >

                {/* CATEGORY NAME */}

                <div className="mb-5">

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    autoFocus
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="mb-5">

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter category description..."
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                  />

                </div>

                {/* STATUS */}

                <div className="mb-6">

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition cursor-pointer"
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

                {/* ==============================
                    BUTTONS
                ============================== */}

                <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-200">

                  {/* CANCEL */}

                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="flex-1 min-h-[50px] bg-slate-100 border-2 border-slate-200 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >

                    <FaTimes />

                    Cancel

                  </button>

                  {/* SAVE / UPDATE */}

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 min-h-[50px] bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >

                    {saving ? (

                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                        Saving...
                      </>

                    ) : (

                      <>
                        <FaSave />

                        {editingId
                          ? "Update Category"
                          : "Save Category"}
                      </>

                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Categories;