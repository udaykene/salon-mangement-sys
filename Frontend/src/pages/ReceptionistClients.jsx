import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import axios from "axios";

const ReceptionistClients = () => {
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/clients");
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert(error.response?.data?.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id) {
        // Update existing client
        await axios.put(`/api/clients/${formData.id}`, formData);
        alert("Client updated successfully!");
      } else {
        // Create new client (branchId will be set automatically by backend)
        await axios.post("/api/clients", formData);
        alert("Client added successfully!");
      }
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", location: "" });
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
    });
    setShowModal(true);
  };

  const handleView = (client) => {
    setViewClient(client);
  };

  // ── derived ──────────────────────────────────
  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const totalClients = clients.length;

  // ══════════════════════════════════════════════
  return (
    <ReceptionistLayout>
      {/* Main Content */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Client Directory
          </h1>
          <p className="text-gray-600">
            View and manage client information
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
            <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
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
                <i className="ri-wallet-3-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Revenue
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${clients.reduce((sum, c) => sum + Number(c.spent.replace(/[$,]/g, "")), 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">From all clients</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Box */}
            <div className="w-full">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
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
                Client Directory ({filtered.length})
              </h2>
              <button
                onClick={() => {
                  setFormData({ name: "", email: "", phone: "", location: "" });
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2"
              >
                <i className="ri-user-add-line text-lg"></i>
                Add Client
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
                Try adjusting your search
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

                        {/* Visit Info */}
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
                        onClick={() => window.location.href = `tel:${client.phone}`}
                        className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 shadow-sm font-medium text-sm"
                        title="Call Client"
                      >
                        <i className="ri-phone-line"></i>
                        Call
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
    </ReceptionistLayout>
  );
};

export default ReceptionistClients;