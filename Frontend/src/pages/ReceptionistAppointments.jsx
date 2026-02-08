import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistAppointments = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: "Sarah Johnson",
      service: "Bridal Makeup",
      date: "2026-02-08",
      time: "10:00 AM",
      status: "confirmed",
      type: "Makeup",
      avatar: "S",
      stylist: "Emma Williams",
      phone: "+91 98765 43210",
      checkedIn: false,
    },
    {
      id: 2,
      clientName: "Emily Davis",
      service: "Hair Coloring",
      date: "2026-02-08",
      time: "11:30 AM",
      status: "waiting",
      type: "Hair",
      avatar: "E",
      stylist: "Lisa Anderson",
      phone: "+91 98765 43211",
      checkedIn: true,
    },
    {
      id: 3,
      clientName: "Lisa Morgan",
      service: "Spa Treatment",
      date: "2026-02-08",
      time: "02:00 PM",
      status: "confirmed",
      type: "Spa",
      avatar: "L",
      stylist: "Maria Garcia",
      phone: "+91 98765 43212",
      checkedIn: false,
    },
    {
      id: 4,
      clientName: "Jessica Wright",
      service: "Nail Art",
      date: "2026-02-08",
      time: "03:30 PM",
      status: "pending",
      type: "Nails",
      avatar: "J",
      stylist: "John Smith",
      phone: "+91 98765 43213",
      checkedIn: false,
    },
    {
      id: 5,
      clientName: "Anna Klein",
      service: "Hair Styling",
      date: "2026-02-09",
      time: "09:30 AM",
      status: "confirmed",
      type: "Hair",
      avatar: "A",
      stylist: "Emma Williams",
      phone: "+91 98765 43214",
      checkedIn: false,
    },
    {
      id: 6,
      clientName: "Maria Santos",
      service: "Facial Treatment",
      date: "2026-02-09",
      time: "01:00 PM",
      status: "confirmed",
      type: "Spa",
      avatar: "M",
      stylist: "Lisa Anderson",
      phone: "+91 98765 43215",
      checkedIn: false,
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
    if (s === "waiting") return "bg-orange-100 text-orange-700 border-orange-200";
    if (s === "completed") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const handleCheckIn = (id) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, checkedIn: true, status: "waiting" } : a
      )
    );
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchDate =
      filterDate === "all" ||
      (filterDate === "today" && a.date === "2026-02-08") ||
      (filterDate === "tomorrow" && a.date === "2026-02-09");
    const matchSearch =
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.stylist.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Appointments
          </h1>
          <p className="text-gray-600">
            View and manage client appointments
          </p>
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
              {appointments.filter((a) => a.date === "2026-02-08").length}
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
                        {!apt.checkedIn && apt.status !== "cancelled" && (
                          <button
                            onClick={() => handleCheckIn(apt.id)}
                            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 border-2 border-green-500 shadow-sm font-medium text-sm"
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
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border-2 border-rose-200 hover:border-rose-500 shadow-sm"
                          title="View Details"
                        >
                          <i className="ri-eye-line text-lg"></i>
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
    </ReceptionistLayout>
  );
};

export default ReceptionistAppointments;