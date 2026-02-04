import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const SalonAdminAppointments = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: "Sarah Johnson",
      service: "Bridal Makeup",
      date: "2026-02-05",
      time: "10:00 AM",
      status: "confirmed",
      type: "Makeup",
      avatar: "S",
    },
    {
      id: 2,
      clientName: "Emily Davis",
      service: "Hair Coloring",
      date: "2026-02-08",
      time: "2:00 PM",
      status: "pending",
      type: "Hair",
      avatar: "E",
    },
    {
      id: 3,
      clientName: "Lisa Morgan",
      service: "Spa Treatment",
      date: "2026-02-10",
      time: "11:30 AM",
      status: "confirmed",
      type: "Spa",
      avatar: "L",
    },
    {
      id: 4,
      clientName: "Jessica Wright",
      service: "Nail Art",
      date: "2026-02-12",
      time: "3:00 PM",
      status: "cancelled",
      type: "Nails",
      avatar: "J",
    },
    {
      id: 5,
      clientName: "Anna Klein",
      service: "Hair Styling",
      date: "2026-02-14",
      time: "9:30 AM",
      status: "pending",
      type: "Hair",
      avatar: "A",
    },
    {
      id: 6,
      clientName: "Maria Santos",
      service: "Facial Treatment",
      date: "2026-02-15",
      time: "1:00 PM",
      status: "confirmed",
      type: "Spa",
      avatar: "M",
    },
  ]);

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

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
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
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    filterStatus === s
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
              <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2">
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
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border-2 border-rose-200 hover:border-rose-500 shadow-sm"
                          title="View Details"
                        >
                          <i className="ri-eye-line text-lg"></i>
                        </button>
                        <button
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
      </main>
    </AdminLayout>
  );
};

export default SalonAdminAppointments;