import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import {
  getServices,
  toggleServiceStatus,
  deleteService,
} from "../api/services";
import { getCategories } from "../api/categories";
import { useAuth } from "../context/AuthContext";
import AddServiceForm from "../components/AddServiceForm";

const ReceptionistServices = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const { user, loading: authLoading } = useAuth();
  const branchId = user?.branchId;

  // ── data ──────────────────────────────────────
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch services and categories on mount ──
  useEffect(() => {
    if (branchId) {
      fetchServices(branchId);
      fetchCategories(branchId);
    } else if (!authLoading) {
      setLoading(false);
      if (!user) {
        setError("Session expired. Please log in again.");
      } else if (!user.branchId) {
        console.warn("User profile loaded but branchId missing:", user);
        setError(
          `No branch ID found for your account (Role: ${user.roleLabel}).`,
        );
      }
    }
  }, [branchId, authLoading, user]);

  const fetchCategories = async (bId) => {
    try {
      const response = await getCategories(bId);
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchServices = async (bId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getServices({ branchId: bId });

      const transformedServices = response.services.map((service) => ({
        id: service._id,
        name: service.name,
        category: service.category?.name || "Uncategorized",
        categoryId: service.category?._id,
        gender: service.gender,
        desc: service.desc || "",
        price: `₹${service.price}`,
        duration: service.duration,
        status: service.status,
        icon: service.icon,
        gradient: service.gradient,
        clients: service.clients,
        branchId: service.branchId._id,
        branchName: service.branchId.name,
      }));

      setServices(transformedServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  // ── derived ───────────────────────────────────
  const genderList = ["all", "Men", "Female", "Unisex"];

  const counts = categories.reduce(
    (acc, cat) => {
      acc[cat._id] = services.filter((s) => s.categoryId === cat._id).length;
      return acc;
    },
    { all: services.length },
  );

  const activeServices = services.filter((s) => s.status === "active").length;

  const filtered = services.filter((sv) => {
    const matchCat =
      filterCategory === "all" || sv.categoryId === filterCategory;
    const matchGender = filterGender === "all" || sv.gender === filterGender;
    const matchSearch =
      searchTerm === "" ||
      sv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchGender && matchSearch;
  });

  // ── Default icons for categories ──
  const getCatIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("hair")) return "ri-scissors-2-line";
    if (n.includes("makeup")) return "ri-brush-3-line";
    if (n.includes("spa") || n.includes("massage")) return "ri-user-heart-line";
    if (n.includes("nail")) return "ri-hand-heart-line";
    return "ri-grid-line";
  };

  const getCatGradient = (index) => {
    const gradients = [
      "from-rose-500 to-pink-500",
      "from-pink-500 to-fuchsia-500",
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-orange-500 to-rose-500",
      "from-emerald-500 to-teal-500",
    ];
    return gradients[index % gradients.length];
  };

  // ── dropdown handlers ──────────────────────────
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleViewDetails = (service) => {
    alert(
      `Service: ${service.name}\nPrice: ${service.price}\nDuration: ${service.duration}\nGender: ${service.gender}\n\n${service.desc}`,
    );
    setDropdownOpen(null);
  };

  const handleToggleStatus = async (serviceId) => {
    try {
      await toggleServiceStatus(serviceId);
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? { ...s, status: s.status === "active" ? "inactive" : "active" }
            : s,
        ),
      );
      setDropdownOpen(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowAddForm(true);
    setDropdownOpen(null);
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        await deleteService(service.id);
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        setDropdownOpen(null);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete service");
      }
    }
  };

  const handleAddService = () => {
    if (branchId) fetchServices(branchId);
    setShowAddForm(false);
    setEditingService(null);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingService(null);
  };

  return (
    <ReceptionistLayout>
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Services Catalog
            </h1>
            <p className="text-gray-600">
              Browse and manage available services
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <i className="ri-add-line text-xl"></i>
            Add Service
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                    <i className="ri-scissors-2-line text-white text-2xl"></i>
                  </div>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                    Total
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Total Services
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {services.length}
                </p>
                <p className="text-xs text-gray-500 mt-2">All offerings</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <i className="ri-checkbox-circle-line text-white text-2xl"></i>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Active Services
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {activeServices}
                </p>
                <p className="text-xs text-gray-500 mt-2">Currently bookable</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex flex-col gap-6">
                {/* Category Pills */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Filter by Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterCategory("all")}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        filterCategory === "all"
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                          : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                      }`}
                    >
                      <span>All</span>
                      <span className="ml-1.5 opacity-75">({counts.all})</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => setFilterCategory(cat._id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                          filterCategory === cat._id
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                            : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                      >
                        <span className="capitalize">{cat.name}</span>
                        <span className="ml-1.5 opacity-75">
                          ({counts[cat._id] || 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Pills */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Gender
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {genderList.map((g) => (
                      <button
                        key={g}
                        onClick={() => setFilterGender(g)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                          filterGender === g
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                            : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                      >
                        <span className="capitalize">{g}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search services by name or description..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filtered.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-scissors-2-line text-4xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 font-medium text-lg">
                    No services found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting your search
                  </p>
                </div>
              ) : (
                filtered.map((sv) => (
                  <div
                    key={sv.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-rose-200 transition-all flex flex-col overflow-hidden group"
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${sv.gradient} group-hover:h-3 transition-all`}
                    />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sv.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <i className={`${sv.icon} text-white text-2xl`}></i>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${
                              sv.status === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {sv.status}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(sv.id)}
                              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <i className="ri-more-2-fill text-gray-600 text-xl"></i>
                            </button>
                            {dropdownOpen === sv.id && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                <button
                                  onClick={() => handleViewDetails(sv)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                >
                                  <i className="ri-eye-line text-rose-500"></i>{" "}
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEdit(sv)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                >
                                  <i className="ri-edit-line text-rose-500"></i>{" "}
                                  Edit Service
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(sv.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                >
                                  <i
                                    className={`${sv.status === "active" ? "ri-pause-circle-line" : "ri-play-circle-line"} text-rose-500`}
                                  ></i>
                                  {sv.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                                <button
                                  onClick={() => handleDelete(sv)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                  <i className="ri-delete-bin-line"></i> Delete
                                  Service
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {sv.name}
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                          {sv.category}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                          {sv.gender}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {sv.desc}
                      </p>

                      <div className="border-t border-gray-100 pt-4 mt-auto space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-2">
                            <i className="ri-money-rupee-circle-line text-rose-500"></i>{" "}
                            Price
                          </span>
                          <span className="font-bold text-gray-900 text-lg">
                            {sv.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-2">
                            <i className="ri-time-line text-rose-500"></i>{" "}
                            Duration
                          </span>
                          <span className="font-bold text-gray-900">
                            {sv.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-2">
                            <i className="ri-team-line text-rose-500"></i>{" "}
                            Clients
                          </span>
                          <span className="font-bold text-gray-900">
                            {sv.clients}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Categories Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-grid-line text-rose-600"></i> Service
                  Categories
                </h2>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, index) => {
                  const count = services.filter(
                    (s) => s.categoryId === cat._id,
                  ).length;
                  const activeCount = services.filter(
                    (s) => s.categoryId === cat._id && s.status === "active",
                  ).length;
                  const gradient = getCatGradient(index);
                  const icon = getCatIcon(cat.name);
                  return (
                    <div
                      key={cat._id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-rose-50 hover:shadow-md border-2 border-transparent hover:border-rose-200 transition-all cursor-pointer group"
                      onClick={() => setFilterCategory(cat._id)}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0`}
                      >
                        <i className={`${icon} text-white text-xl`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-base">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {count} services · {activeCount} available
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <AddServiceForm
              onSubmit={handleAddService}
              onClose={handleCloseForm}
              editingService={editingService}
            />
          </div>
        </div>
      )}
    </ReceptionistLayout>
  );
};

export default ReceptionistServices;
