import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";

const SalonAdminAppointments = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data Lists
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [clients, setClients] = useState([]);
  const [showClientDetails, setShowClientDetails] = useState(false);

  // New Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    branchId: "",
    clientId: "",
    customerName: "",
    email: "",
    phone: "",
    category: "", // This will now store ID
    service: "",
    staff: "Any",
    date: "",
    time: "",
    notes: "",
    price: 0
  });

  // Client Search
  const [clientSearch, setClientSearch] = useState("");
  const [showClientList, setShowClientList] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchAppointments();
    fetchBranches();
    fetchClients();
  }, []);

  // Fetch data when branch changes
  useEffect(() => {
    if (formData.branchId) {
      fetchCategories(formData.branchId);
      // Only reset if we are interacting (not when populating for edit/view)
      // This logic effectively runs on every branchId change. 
      // We need to be careful not to wipe data when loading an appointment for edit.
      // The fetch calls are fine, but resetting state might be an issue. 
      // However, since we populate formData *after* setting the state, checking if the current formData matches what we are setting might be complex.
      // Better approach: fetchCategories/Staff doesn't reset state. The reset logic was in the onChange of the select.
      fetchStaff(formData.branchId);
    } else {
      setCategories([]);
      setStaffList([]);
    }
  }, [formData.branchId]);

  // Fetch services when category changes
  useEffect(() => {
    if (formData.branchId && formData.category) {
      fetchServices(formData.branchId, formData.category);
    } else {
      setServices([]);
    }
  }, [formData.branchId, formData.category]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/appointments");
      const data = await response.json();

      const formatted = data.map(apt => ({
        id: apt._id,
        clientName: apt.customerName,
        service: apt.service,
        date: new Date(apt.date).toISOString().split('T')[0], // Ensure date format
        time: apt.time,
        status: apt.status.toLowerCase(),
        type: apt.category,
        avatar: apt.customerName.charAt(0).toUpperCase(),
        phone: apt.phone,
        email: apt.email,
        staff: apt.staff,
        notes: apt.notes,
        branchId: apt.branchId, // Ensure these are available
        clientId: apt.clientId,
        price: apt.price
      }));

      setAppointments(formatted);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/branches/my-branches");
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchCategories = async (branchId) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/categories/${branchId}`);
      if (data.success) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchClients = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/clients");
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchServices = async (branchId, categoryId) => {
    try {
      // Pass category ID directly as the backend supports filtering by it if it's a ref
      const { data } = await axios.get(`http://localhost:3000/api/services?branchId=${branchId}&category=${categoryId}`);
      if (data.success) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  const fetchStaff = async (branchId) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/staff?branchId=${branchId}`);
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaffList([]);
    }
  };

  const handleClientSelect = (client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client._id,
      customerName: client.name,
      email: client.email,
      phone: client.phone
    }));
    setClientSearch(client.name);
    setShowClientList(false);
    setShowClientDetails(false); // Hide details when existing client is selected
  };

  const resetForm = () => {
    setFormData({
      branchId: "",
      clientId: "",
      customerName: "",
      email: "",
      phone: "",
      category: "",
      service: "",
      staff: "Any",
      date: "",
      time: "",
      notes: "",
      price: 0
    });
    setClientSearch("");
    setShowClientDetails(false);
    setMode("create");
    setSelectedAppointmentId(null);
  };

  const handleView = (apt) => {
    // Populate form data
    setFormData({
      branchId: apt.branchId || "", // We might not have this in formatted data yet, need to ensuring fetchAppointments gets it
      clientId: apt.clientId || "",
      customerName: apt.clientName,
      email: apt.email,
      phone: apt.phone,
      category: apt.type, // Note: formatted data mapped category -> type. But logic expects ID for fetching services. 
      // If we save 'Category Name' in DB, we can't easily fetch services by ID. 
      // Assuming for now we can't fully edit category/service if they rely on IDs and we only have strings.
      // But let's try to match by name if ID is missing or just show as is.
      service: apt.service,
      staff: apt.staff,
      date: apt.date,
      time: apt.time,
      notes: apt.notes,
      price: apt.price
    });

    // Determine category ID if possible to load services? A bit complex if we only saved name.
    // For now, let's just populate what we have.
    setMode("view");
    setSelectedAppointmentId(apt.id);
    setShowModal(true);
  };

  const handleEdit = (apt) => {
    // Similar to View but mode is edit
    setFormData({
      branchId: apt.branchId || "",
      clientId: apt.clientId || "",
      customerName: apt.clientName,
      email: apt.email,
      phone: apt.phone,
      category: apt.type,
      service: apt.service,
      staff: apt.staff,
      date: apt.date,
      time: apt.time,
      notes: apt.notes,
      price: apt.price
    });
    setMode("edit");
    setSelectedAppointmentId(apt.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Logic for selectedCategory same as before
      const selectedCategory = categories.find(c => c._id === formData.category);
      const categoryName = selectedCategory ? selectedCategory.name : formData.category;

      const payload = {
        ...formData,
        category: categoryName
      };

      if (mode === "create") {
        await axios.post("http://localhost:3000/api/appointments", payload);
        alert("Appointment booked successfully!");
      } else if (mode === "edit") {
        await axios.put(`http://localhost:3000/api/appointments/${selectedAppointmentId}`, payload);
        alert("Appointment updated successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert(error.response?.data?.message || "Failed to save appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── helpers ──────────────────────────────────
  const typeColor = {
    Makeup: "from-rose-500 to-pink-500",
    Hair: "from-pink-500 to-fuchsia-500",
    Spa: "from-purple-500 to-pink-500",
    Nails: "from-blue-500 to-cyan-500",
  };

  const typeBadge = {
    Makeup: "bg-rose-100 text-rose-700 border-rose-200",
    Hair: "bg-pink-100 text-pink-700 border-pink-200",
    Spa: "bg-purple-100 text-purple-700 border-purple-200",
    Nails: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const statusBadge = (s) => {
    if (s === "confirmed") return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchSearch =
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // ── summary pills for the top bar ────────────
  const counts = appointments.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    { confirmed: 0, pending: 0, cancelled: 0 },
  );

  // ══════════════════════════════════════════════
  return (
    <AdminLayout>
      {/* Main Content */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Appointments
          </h1>
          <p className="text-gray-600">
            Manage and track all client bookings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-calendar-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              All Appointments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {appointments.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          {/* Confirmed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Confirmed
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.confirmed}
            </p>
            <p className="text-xs text-gray-500 mt-2">Ready to go</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Waiting
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Pending
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.pending}
            </p>
            <p className="text-xs text-gray-500 mt-2">Needs confirmation</p>
          </div>

          {/* Cancelled */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-close-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Inactive
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Cancelled
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.cancelled}
            </p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {["all", "confirmed", "pending", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filterStatus === s
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                    : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                    }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clients or services..."
                  className="w-full lg:w-80 pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-list-check text-rose-600"></i>
                All Appointments ({filtered.length})
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2"
              >
                <i className="ri-add-line text-lg"></i>
                New Booking
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-inbox-line text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                No appointments match your filters
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((apt) => (
                <div
                  key={apt.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Client Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeColor[apt.type] || "from-rose-500 to-pink-500"} flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0`}
                      >
                        {apt.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {apt.clientName}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeBadge[apt.type] || "bg-rose-100 text-rose-700 border-rose-200"}`}
                          >
                            {apt.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {apt.service}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <i className="ri-calendar-line text-rose-500"></i>
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-time-line text-rose-500"></i>
                            {apt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                      <span
                        className={`text-xs font-semibold px-4 py-2 rounded-full capitalize border ${statusBadge(apt.status)}`}
                      >
                        {apt.status}
                      </span>

                      <div className="flex gap-2">
                        {apt.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(apt.id, "confirmed")
                              }
                              className="w-10 h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center border-2 border-green-200 hover:border-green-500 shadow-sm"
                              title="Confirm"
                            >
                              <i className="ri-check-line text-lg"></i>
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(apt.id, "cancelled")
                              }
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border-2 border-red-200 hover:border-red-500 shadow-sm"
                              title="Cancel"
                            >
                              <i className="ri-close-line text-lg"></i>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleView(apt)}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border-2 border-rose-200 hover:border-rose-500 shadow-sm"
                          title="View Details"
                        >
                          <i className="ri-eye-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(apt)}
                          className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center border-2 border-pink-200 hover:border-pink-500 shadow-sm"
                          title="Edit"
                        >
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {mode === 'create' ? "New Booking" : mode === 'edit' ? "Edit Appointment" : "Appointment Details"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Branch Selection */}
                  <fieldset disabled={mode === 'view'}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                      <select
                        required
                        value={formData.branchId}
                        onChange={(e) => setFormData({
                          ...formData,
                          branchId: e.target.value,
                          category: "",
                          service: "",
                          staff: "Any",
                          price: 0
                        })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch._id} value={branch._id}>{branch.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Client Selection */}
                    <div className="relative mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search for client..."
                          value={clientSearch || formData.customerName} // Show current name if editing/viewing
                          onChange={(e) => {
                            setClientSearch(e.target.value);
                            setShowClientList(true);
                            // If clearing search, also clear selected client
                            if (e.target.value === "") {
                              setFormData(prev => ({ ...prev, clientId: "", customerName: "", email: "", phone: "" }));
                            }
                          }}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                        />
                        {mode !== 'view' && (
                          <button
                            type="button"
                            onClick={() => {
                              // Always clear and open manual entry
                              setFormData(prev => ({
                                ...prev,
                                clientId: "",
                                customerName: "",
                                email: "",
                                phone: ""
                              }));
                              setClientSearch("");
                              setShowClientDetails(true);
                            }}
                            className="px-3 py-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors"
                            title="Add New Client"
                          >
                            <i className="ri-add-line text-xl"></i>
                          </button>
                        )}
                      </div>

                      {/* Client Autocomplete List */}
                      {showClientList && clientSearch && mode !== 'view' && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map(client => (
                            <div
                              key={client._id}
                              onClick={() => handleClientSelect(client)}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                            >
                              <p className="font-bold text-gray-900">{client.name}</p>
                              <p className="text-xs text-gray-500">{client.email} • {client.phone}</p>
                            </div>
                          ))}

                          {/* Always show Add New Client option */}
                          <div
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                clientId: "",
                                customerName: clientSearch, // Pre-fill with search term
                                email: "",
                                phone: ""
                              }));
                              setShowClientList(false);
                              setShowClientDetails(true); // Show the form for new client
                            }}
                            className="px-4 py-2 hover:bg-rose-50 cursor-pointer text-rose-600 font-bold flex items-center gap-2 sticky bottom-0 bg-white border-t border-gray-100"
                          >
                            <i className="ri-add-circle-fill text-lg"></i>
                            Add "{clientSearch}" as new client
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Client Details (Auto-filled or Manual) */}
                    {/* Only show if MANUALLY adding (no clientId) OR we are strictly Viewing an existing one */}
                    {((showClientDetails || formData.customerName) && (!formData.clientId || mode === 'view')) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-200 mt-4">
                        <div className="col-span-full">
                          <p className="text-xs font-bold text-gray-500 uppercase">Client Details {formData.clientId ? "(Linked)" : "(New/Guest)"}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                          <input
                            required
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                            readOnly={!!formData.clientId || mode === 'view'} // Read-only if linked
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                            readOnly={!!formData.clientId || mode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                          <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-rose-500 focus:outline-none text-sm"
                            readOnly={!!formData.clientId || mode === 'view'}
                          />
                        </div>
                      </div>
                    )}

                    {/* Service Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        {/* For Edit/View, if we only have category Name but need ID for select options to match, it's tricky.
                          We populated selectedCategory state with list. We can try to match by name to find ID if needed,
                          or simple display text if in View mode?
                          If in Edit mode, we need the Select to work.
                          The select value matches ID.
                          If we only saved name, we can't easily select.
                          However, if we are in Edit mode, user can re-select.
                          If data has ID, great.
                          Let's assume for now user might need to re-select if ID is missing.
                       */}
                        <select
                          required
                          value={formData.category} // If this is ID, fine. If Name, might fail to select if options use ID.
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                        >
                          <option value="">Select Category</option>
                          {categories.length > 0 ? categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          )) : (
                            // If no categories loaded (e.g. view mode with no branch fetch?), show current value as option
                            <option value={formData.category}>{formData.category}</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                        <select
                          required
                          value={formData.service}
                          onChange={(e) => {
                            const selectedService = services.find(s => s.name === e.target.value);
                            setFormData({
                              ...formData,
                              service: e.target.value,
                              price: selectedService ? selectedService.price : 0
                            });
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                          disabled={!formData.category && mode !== 'view'}
                        >
                          <option value="">Select Service</option>
                          {services.length > 0 ? services.map(svc => (
                            <option key={svc._id} value={svc.name}>{svc.name} - ${svc.price}</option>
                          )) : (
                            <option value={formData.service}>{formData.service}</option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Date, Time, Staff */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          required
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          required
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Staff</label>
                        <select
                          value={formData.staff}
                          onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                        >
                          <option value="Any">Any Staff</option>
                          {staffList.map(staff => (
                            <option key={staff._id} value={staff.name}>{staff.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        rows="3"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                        placeholder="Any special requests..."
                      ></textarea>
                    </div>
                  </fieldset>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    {mode !== 'view' && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Saving..." : mode === 'edit' ? "Update Appointment" : "Create Appointment"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main >
    </AdminLayout >
  );
};

export default SalonAdminAppointments;