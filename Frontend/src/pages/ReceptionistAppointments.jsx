import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import axios from "axios";
import AppointmentForm from "../components/AppointmentForm";
import { useAuth } from "../context/AuthContext";

const ReceptionistAppointments = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

  const [appointments, setAppointments] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const fetchAppointments = async () => {
    // Ensure we have a branchId.
    // If user.branchId is an object (rare but possible with population), try to get _id.
    const branchId = user?.branchId?._id || user?.branchId;

    if (!branchId) {
      console.warn("fetchAppointments: No branchId found for user", user);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/appointments?branchId=${branchId}`,
      );
      const data = response.data; // axios returns data in .data

      const formatted = data.map((apt) => ({
        id: apt._id,
        clientName: apt.customerName,
        customerName: apt.customerName, // For form compatibility
        service: apt.service,
        date: new Date(apt.date).toISOString().split("T")[0],
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
        checkedIn: false,
      }));

      setAppointments(formatted);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleView = (apt) => {
    setSelectedAppointmentId(apt.id);
    setMode("view");
    setShowModal(true);
  };

  const handleEdit = (apt) => {
    setSelectedAppointmentId(apt.id);
    setMode("edit");
    setShowModal(true);
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
    if (s === "confirmed")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "waiting")
      return "bg-orange-100 text-orange-700 border-orange-200";
    if (s === "completed") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const handleCheckIn = (id) => {
    // Ideally this should update backend status to 'waiting' or proper check-in flag
    handleStatusChange(id, "waiting");
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: newStatus,
                  checkedIn: newStatus === "waiting" ? true : a.checkedIn,
                }
              : a,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;

    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const matchDate =
      filterDate === "all" ||
      (filterDate === "today" && a.date === todayStr) ||
      (filterDate === "tomorrow" && a.date === tomorrowStr);

    const matchSearch =
      (a.clientName &&
        a.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.service &&
        a.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.stylist && a.stylist.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchDate && matchSearch;
  });

  // ── summary counts ────────────
  const counts = appointments.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    { confirmed: 0, pending: 0, waiting: 0, completed: 0 },
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
            <p className="text-gray-600">View and manage client appointments</p>
          </div>
          <button
            onClick={() => {
              setMode("create");
              setSelectedAppointmentId(null);
              setShowModal(true);
            }}
            disabled={!user?.branchId}
            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center ${
              !user?.branchId
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-1"
            }`}
          >
            <i className="ri-add-line text-xl"></i>
            {user?.branchId ? "New Booking" : "Loading..."}
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
              {
                appointments.filter(
                  (a) => a.date === new Date().toISOString().split("T")[0],
                ).length
              }
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
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pending</h3>
            <p className="text-3xl font-bold text-gray-900">{counts.pending}</p>
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
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      filterDate === d
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
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                          filterStatus === s
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                            : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ),
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
        {/* Modal */}
        {/* Modal handled by AppointmentForm */}
        <AppointmentForm
          isOpen={showModal}
          initialData={
            mode === "create"
              ? { branchId: user?.branchId }
              : appointments.find((a) => a.id === selectedAppointmentId)
          }
          mode={mode}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAppointments();
          }}
          role="receptionist"
        />
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistAppointments;
