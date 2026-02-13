import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import axios from "axios";

const ReceptionistAppointments = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");
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
  const [showClientList, setShowClientList] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  // Modal State
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
    category: "",
    service: "",
    staff: "Any",
    date: "",
    time: "",
    notes: "",
    price: 0
  });

  useEffect(() => {
    fetchAppointments();
    fetchBranches();
    fetchClients();
  }, []);

  // Fetch data when branch changes
  useEffect(() => {
    if (formData.branchId) {
      fetchCategories(formData.branchId);
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
        date: new Date(apt.date).toISOString().split('T')[0],
        time: apt.time,
        status: apt.status.toLowerCase(),
        type: apt.category,
        avatar: apt.customerName.charAt(0).toUpperCase(),
        phone: apt.phone,
        email: apt.email,
        staff: apt.staff,
        notes: apt.notes,
        branchId: apt.branchId,
        clientId: apt.clientId,
        price: apt.price,
        checkedIn: false
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
      // Auto-select first branch if available and nothing selected
      if (data.length > 0 && !formData.branchId) {
        setFormData(prev => ({ ...prev, branchId: data[0]._id }));
      }
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
    setShowClientDetails(false);
  };

  const resetForm = () => {
    setFormData({
      branchId: branches.length > 0 ? branches[0]._id : "",
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
    setFormData({
      branchId: apt.branchId || (branches.length > 0 ? branches[0]._id : ""),
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
    setMode("view");
    setSelectedAppointmentId(apt.id);
    setShowModal(true);
  };

  const handleEdit = (apt) => {
    setFormData({
      branchId: apt.branchId || (branches.length > 0 ? branches[0]._id : ""),
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
      const payload = { ...formData, status: "pending" }; // Default to pending for new

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
      alert("Failed to save appointment. Please try again.");
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
    if (s === "waiting") return "bg-orange-100 text-orange-700 border-orange-200";
    if (s === "completed") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const handleCheckIn = (id) => {
    // Ideally this should update backend status to 'waiting' or proper check-in flag
    handleStatusChange(id, "waiting");
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
          prev.map((a) => (a.id === id ? { ...a, status: newStatus, checkedIn: newStatus === 'waiting' ? true : a.checkedIn } : a))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const matchDate =
      filterDate === "all" ||
      (filterDate === "today" && a.date === todayStr) ||
      (filterDate === "tomorrow" && a.date === tomorrowStr);

    const matchSearch =
      (a.clientName && a.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.service && a.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.stylist && a.stylist.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchDate && matchSearch;
  });

  // ── summary counts ────────────
  const counts = appointments.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    { confirmed: 0, pending: 0, waiting: 0, completed: 0 }
  );

  // ══════════════════════════════════════════════
  return (
    <ReceptionistLayout>
      {/* Main Content */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Appointments
            </h1>
            <p className="text-gray-600">
              View and manage client appointments
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <i className="ri-add-line text-xl"></i>
            New Booking
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Today */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-calendar-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Today's Total
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {appointments.filter((a) => a.date === new Date().toISOString().split('T')[0]).length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Scheduled for today</p>
          </div>

          {/* Confirmed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Ready
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Confirmed
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.confirmed}
            </p>
            <p className="text-xs text-gray-500 mt-2">Ready for check-in</p>
          </div>

          {/* Waiting/In Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-follow-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Waiting/In Progress
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.waiting || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Currently being served</p>
          </div>

          {/* Pending Confirmation */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Pending
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.pending}
            </p>
            <p className="text-xs text-gray-500 mt-2">Awaiting confirmation</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Date Filter Pills */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Filter by Date
              </label>
              <div className="flex flex-wrap gap-2">
                {["today", "tomorrow", "all"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDate(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filterDate === d
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                      : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                      }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Status Filter Pills */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Filter by Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "confirmed", "pending", "waiting", "completed"].map(
                    (s) => (
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
                    )
                  )}
                </div>
              </div>

              {/* Search Box */}
              <div className="w-full lg:w-auto lg:self-end">
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by client, service, or stylist..."
                    className="w-full lg:w-96 pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  />
                </div>
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
                Appointments ({filtered.length})
              </h2>
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
                          {apt.checkedIn && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200">
                              Checked In
                            </span>
                          )}
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
                          <span className="flex items-center gap-2">
                            <i className="ri-scissors-2-line text-rose-500"></i>
                            {apt.stylist}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-phone-line text-rose-500"></i>
                            {apt.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <span
                        className={`text-xs font-semibold px-4 py-2 rounded-full capitalize border ${statusBadge(apt.status)}`}
                      >
                        {apt.status}
                      </span>

                      <div className="flex gap-2">
                        {apt.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.id, "confirmed")}
                              className="w-10 h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center border-2 border-green-200 hover:border-green-500 shadow-sm"
                              title="Confirm"
                            >
                              <i className="ri-check-line text-lg"></i>
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, "cancelled")}
                              className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border-2 border-red-200 hover:border-red-500 shadow-sm"
                              title="Cancel"
                            >
                              <i className="ri-close-line text-lg"></i>
                            </button>
                          </>
                        )}
                        {!apt.checkedIn && apt.status === "confirmed" && (
                          <button
                            onClick={() => handleCheckIn(apt.id)}
                            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 border-2 border-green-500 shadow-sm font-medium text-sm"
                            title="Check In"
                          >
                            <i className="ri-login-circle-line"></i>
                            Check In
                          </button>
                        )}
                        <button
                          className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border-2 border-blue-200 hover:border-blue-500 shadow-sm"
                          title="Call Client"
                        >
                          <i className="ri-phone-line text-lg"></i>
                        </button>
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-rose-50 to-pink-50">
                <h2 className="text-2xl font-bold text-gray-800">
                  {mode === 'create' ? "New Booking" : mode === 'edit' ? "Edit Appointment" : "Appointment Details"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-rose-100 text-gray-400 hover:text-rose-500 flex items-center justify-center transition-colors shadow-sm"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset disabled={mode === 'view'}>
                    <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-100 mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="ri-user-line text-rose-500"></i>
                        Client Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Search/Select */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                              <input
                                type="text"
                                value={clientSearch}
                                onChange={(e) => {
                                  setClientSearch(e.target.value);
                                  setShowClientList(true);
                                }}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                                placeholder="Search client..."
                              />
                              {showClientList && clientSearch && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                  {clients
                                    .filter(c => c.name?.toLowerCase().includes(clientSearch.toLowerCase()))
                                    .map(client => (
                                      <div
                                        key={client._id}
                                        onClick={() => handleClientSelect(client)}
                                        className="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
                                      >
                                        {client.name} ({client.phone})
                                      </div>
                                    ))}
                                  <div
                                    className="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm text-rose-600 font-semibold border-t border-gray-100"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        customerName: clientSearch,
                                        clientId: "" // Clear ID for new client
                                      }));
                                      setShowClientList(false);
                                      setShowClientDetails(true);
                                    }}
                                  >
                                    + Add "{clientSearch}"
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  clientId: "",
                                  customerName: "",
                                  email: "",
                                  phone: ""
                                }));
                                setClientSearch("");
                                setShowClientDetails(true);
                                setShowClientList(false);
                              }}
                              className="px-3 py-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors"
                              title="Add New Client"
                            >
                              <i className="ri-add-line text-xl"></i>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                            placeholder="+1 234 567 890"
                            required
                          />
                        </div>

                        {((showClientDetails || formData.customerName) && (!formData.clientId || mode === 'view')) && (
                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                                placeholder="client@example.com"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                        <select
                          value={formData.branchId}
                          onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                          required
                        >
                          <option value="">Select Branch</option>
                          {branches.map(branch => (
                            <option key={branch._id} value={branch._id}>{branch.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={formData.category} // Assuming category name string if that's what we have
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                          required
                        >
                          <option value="">Select Service</option>
                          {services.map(service => (
                            <option key={service._id} value={service.name}>{service.name} - ${service.price}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                          required
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
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistAppointments;