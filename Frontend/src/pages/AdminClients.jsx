import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useBranch } from "../context/BranchContext";
import axios from "axios";

const SalonAdminClients = () => {
  const { branches } = useBranch();
  const [filterBranch, setFilterBranch] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    branchId: "",
  });

  const handleView = (client) => {
    setViewClient(client);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [filterBranch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await axios.put(`/api/clients/${formData.id}`, formData);
        alert("Client updated successfully!");
      } else {
        await axios.post("/api/clients", formData);
        alert("Client added successfully!");
      }
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", location: "", branchId: "" });
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
      alert(error.response?.data?.message || "Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      location: client.location,
      branchId: client.branchId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`/api/clients/${id}`);
        fetchClients();
        alert("Client deleted successfully");
      } catch (error) {
        console.error("Error deleting client:", error);
        alert(error.response?.data?.message || "Failed to delete client");
      }
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      let url = "/api/clients";
      
      // Add branch filter if specific branch is selected
      if (filterBranch !== "all") {
        url += `?branchId=${filterBranch}`;
      }
      
      const { data } = await axios.get(url);
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── derived ──────────────────────────────────
  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const totalSpent = clients.reduce((sum, c) => {
    return sum + Number(c.spent.replace(/[$,]/g, ""));
  }, 0);

  // Get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // ══════════════════════════════════════════════
  return (
    <AdminLayout>
      {/* Main Content */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Clients
          </h1>
          <p className="text-gray-600">
            Manage and track all registered clients
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {clients.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Registered users</p>
          </div>

          {/* Total Visits */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-scissors-2-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Visits
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Visits
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {clients.reduce((sum, c) => sum + c.visits, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">All appointments</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-money-dollar-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                All time
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">From all clients</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Branch Filter Dropdown */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">
                Filter by Branch:
              </label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 bg-white text-sm font-medium"
              >
                <option value="all">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email or location..."
                  className="w-full lg:w-80 pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-user-3-line text-rose-600"></i>
                All Clients ({filtered.length})
              </h2>
              <button
                onClick={() => {
                  setFormData({ name: "", email: "", phone: "", location: "", branchId: "" });
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2"
              >
                <i className="ri-user-add-line text-lg"></i>
                New Client
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                Loading clients...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-search-line text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                No clients found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((client) => (
                <div
                  key={client.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Client Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${client.gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0`}
                      >
                        {client.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {client.name}
                          </h3>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            {getBranchName(client.branchId)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-2">
                            <i className="ri-map-pin-line text-rose-500"></i>
                            {client.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-mail-line text-rose-500"></i>
                            {client.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-phone-line text-rose-500"></i>
                            {client.phone}
                          </span>
                        </div>

                        {/* Stats Pills */}
                        <div className="flex flex-wrap gap-2">
                          <span className="flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200">
                            <i className="ri-scissors-2-line"></i>
                            {client.visits} visits
                          </span>
                          <span className="flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-pink-200">
                            <i className="ri-wallet-3-line"></i>
                            {client.spent} spent
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(client)}
                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border-2 border-rose-200 hover:border-rose-500 shadow-sm"
                        title="View Details"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(client)}
                        className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center border-2 border-pink-200 hover:border-pink-500 shadow-sm"
                        title="Edit"
                      >
                        <i className="ri-edit-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border-2 border-red-200 hover:border-red-500 shadow-sm"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Client Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {formData.id ? "Edit Client" : "Add New Client"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="e.g. sarah@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="e.g. +1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="e.g. Downtown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    name="branchId"
                    required
                    value={formData.branchId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : formData.id
                        ? "Update Client"
                        : "Save Client"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Client Modal */}
        {viewClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Client Details
                </h3>
                <button
                  onClick={() => setViewClient(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${viewClient.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4`}
                  >
                    {viewClient.avatar}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {viewClient.name}
                  </h2>
                  <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    {getBranchName(viewClient.branchId)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm">
                      <i className="ri-mail-line text-lg"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900 font-semibold">
                        {viewClient.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm">
                      <i className="ri-phone-line text-lg"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900 font-semibold">
                        {viewClient.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm">
                      <i className="ri-map-pin-line text-lg"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Location
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {viewClient.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                      <p className="text-xs text-rose-600 font-medium mb-1">
                        Total Visits
                      </p>
                      <p className="text-xl font-bold text-rose-700">
                        {viewClient.visits}
                      </p>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 text-center">
                      <p className="text-xs text-pink-600 font-medium mb-1">
                        Total Spent
                      </p>
                      <p className="text-xl font-bold text-pink-700">
                        {viewClient.spent}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setViewClient(null)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default SalonAdminClients;