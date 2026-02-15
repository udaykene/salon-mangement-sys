import React, { useState, useEffect } from "react";
import { useBranch } from "../context/BranchContext";
import { useAuth } from "../context/AuthContext";
import { useService } from "../context/ServiceContext";
import { useCategory } from "../context/CategoryContext";
import {
  GENDER_OPTIONS,
  ICON_OPTIONS,
  GRADIENT_OPTIONS,
} from "../constants/serviceConstants";

const AddServiceForm = ({ onSubmit, onClose, editingService }) => {
  const { branches } = useBranch();
  const { user, role } = useAuth();
  const { createService, updateService } = useService();
  const { categories, fetchCategories, createCategory } = useCategory();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gender: "Unisex",
    description: "",
    price: "",
    duration: "",
    icon: "ri-scissors-2-line",
    gradient: "from-rose-500 to-pink-500",
    status: "active",
    branchId: role === "receptionist" ? user?.branchId : "",
  });

  // Fetch categories when branch changes
  useEffect(() => {
    if (formData.branchId) {
      fetchCategories(formData.branchId);
    }
  }, [formData.branchId, fetchCategories]);

  // Populate form if editing
  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name || "",
        category: editingService.categoryId || "",
        gender: editingService.gender || "Unisex",
        description: editingService.desc || "",
        price: editingService.price || "",
        duration: editingService.duration || "",
        icon: editingService.icon || "ri-scissors-2-line",
        gradient: editingService.gradient || "from-rose-500 to-pink-500",
        status: editingService.status || "active",
        branchId: editingService.branchId || "",
      });
    }
  }, [editingService]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setLoading(true);
      const cat = await createCategory({
        branchId: formData.branchId,
        name: newCategoryName.trim(),
      });
      if (cat) {
        setFormData((prev) => ({ ...prev, category: cat._id }));
        setNewCategoryName("");
        setShowNewCategoryInput(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Clear category if branch changes
      ...(name === "branchId" ? { category: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.duration ||
      !formData.branchId ||
      !formData.gender
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const servicePayload = {
        name: formData.name,
        category: formData.category,
        gender: formData.gender,
        desc: formData.description,
        price: Number(formData.price),
        duration: formData.duration,
        icon: formData.icon,
        gradient: formData.gradient,
        status: formData.status,
        branchId: formData.branchId,
      };

      if (editingService) {
        await updateService(editingService.id, servicePayload);
      } else {
        await createService(servicePayload);
      }
      onSubmit();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save service",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-rose-500 to-pink-500 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="ri-scissors-2-line"></i>
            {editingService ? "Edit Service" : "Add New Service"}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {editingService
              ? "Update service details"
              : "Fill in details to add a new service"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm flex items-center gap-2">
            <i className="ri-error-warning-line"></i>
            {error}
          </p>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-information-line text-rose-500"></i>
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Hair Cut & Style"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch *
              </label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                required
                disabled={editingService || role === "receptionist"}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="space-y-2">
                {!showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      disabled={!formData.branchId}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white disabled:bg-gray-100"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(true)}
                      disabled={!formData.branchId}
                      className="px-4 py-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50"
                      title="Add new category"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="flex-1 px-4 py-3 rounded-xl border border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-3 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(false)}
                      className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the service..."
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-money-rupee-circle-line text-rose-500"></i>
            Pricing & Duration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1500"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 45 min, 1.5 hrs"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-palette-line text-rose-500"></i>
            Visual Appearance
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ICON_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, icon: option.value }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.icon === option.value
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200 hover:border-rose-300"
                    }`}
                    title={option.label}
                  >
                    <i
                      className={`${option.value} text-2xl ${formData.icon === option.value ? "text-rose-500" : "text-gray-600"}`}
                    ></i>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color Gradient
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GRADIENT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        gradient: option.value,
                      }))
                    }
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.gradient === option.value
                        ? "border-rose-500 ring-2 ring-rose-200"
                        : "border-gray-200 hover:border-rose-300"
                    }`}
                  >
                    <div className={`h-8 rounded-lg ${option.color}`}></div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preview
              </label>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${formData.gradient} flex items-center justify-center shadow-lg`}
                >
                  <i className={`${formData.icon} text-white text-3xl`}></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {formData.name || "Service Name"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {showNewCategoryInput
                      ? newCategoryName || "New Category"
                      : categories.find((c) => c._id === formData.category)
                          ?.name || "Category"}
                  </p>
                  {formData.price && (
                    <p className="text-sm text-rose-600 font-semibold mt-1">
                      ₹{formData.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-checkbox-circle-line text-rose-500"></i>
            Status
          </h3>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === "active"}
                onChange={handleChange}
                className="w-4 h-4 text-rose-500 focus:ring-rose-400"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === "inactive"}
                onChange={handleChange}
                className="w-4 h-4 text-red-500 focus:ring-red-400"
              />
              <span className="text-sm font-medium text-gray-700">
                Inactive
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {editingService ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <i
                className={editingService ? "ri-save-line" : "ri-add-line"}
              ></i>
              {editingService ? "Update Service" : "Add Service"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddServiceForm;
