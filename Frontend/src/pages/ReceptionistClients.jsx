import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistClients = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [clients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+91 98765 43210",
      status: "active",
      location: "Downtown",
      visits: 14,
      spent: "₹45,240",
      avatar: "S",
      gradient: "from-rose-500 to-pink-500",
      lastVisit: "2026-02-05",
      upcomingAppointment: "2026-02-10 - Hair Styling",
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+91 98765 43211",
      status: "active",
      location: "Midtown",
      visits: 8,
      spent: "₹28,680",
      avatar: "E",
      gradient: "from-pink-500 to-fuchsia-500",
      lastVisit: "2026-02-03",
      upcomingAppointment: "2026-02-08 - Hair Coloring",
    },
    {
      id: 3,
      name: "Lisa Morgan",
      email: "lisa.m@email.com",
      phone: "+91 98765 43212",
      status: "inactive",
      location: "Westside",
      visits: 3,
      spent: "₹12,310",
      avatar: "L",
      gradient: "from-purple-500 to-pink-500",
      lastVisit: "2025-12-20",
      upcomingAppointment: null,
    },
    {
      id: 4,
      name: "Jessica Wright",
      email: "jessica.w@email.com",
      phone: "+91 98765 43213",
      status: "active",
      location: "Eastend",
      visits: 21,
      spent: "₹82,100",
      avatar: "J",
      gradient: "from-blue-500 to-cyan-500",
      lastVisit: "2026-02-06",
      upcomingAppointment: "2026-02-12 - Nail Art",
    },
    {
      id: 5,
      name: "Anna Klein",
      email: "anna.k@email.com",
      phone: "+91 98765 43214",
      status: "active",
      location: "Uptown",
      visits: 6,
      spent: "₹22,520",
      avatar: "A",
      gradient: "from-rose-400 to-pink-400",
      lastVisit: "2026-02-04",
      upcomingAppointment: "2026-02-09 - Hair Styling",
    },
    {
      id: 6,
      name: "Maria Santos",
      email: "maria.s@email.com",
      phone: "+91 98765 43215",
      status: "inactive",
      location: "Harbor",
      visits: 2,
      spent: "₹8,180",
      avatar: "M",
      gradient: "from-pink-400 to-fuchsia-400",
      lastVisit: "2025-11-15",
      upcomingAppointment: null,
    },
  ]);

  // ── derived ──────────────────────────────────
  const counts = clients.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { active: 0, inactive: 0 }
  );

  const filtered = clients.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalClients = clients.length;
  const activeToday = clients.filter(
    (c) => c.upcomingAppointment && c.upcomingAppointment.includes("2026-02-08")
  ).length;

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
            View client information and contact details
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Active Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-heart-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">{counts.active}</p>
            <p className="text-xs text-gray-500 mt-2">Regular visitors</p>
          </div>

          {/* Expected Today */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-calendar-check-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Expected Today
            </h3>
            <p className="text-3xl font-bold text-gray-900">{activeToday}</p>
            <p className="text-xs text-gray-500 mt-2">With appointments</p>
          </div>

          {/* Inactive Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-unfollow-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Inactive
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Inactive Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.inactive}
            </p>
            <p className="text-xs text-gray-500 mt-2">Need follow-up</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {["all", "active", "inactive"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    filterStatus === s
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                      : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <span className="capitalize">{s}</span>
                  <span className="ml-1.5 opacity-75">
                    ({s === "all" ? clients.length : counts[s]})
                  </span>
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
                  placeholder="Search by name, email, phone..."
                  className="w-full lg:w-96 pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
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
            </div>
          </div>

          {filtered.length === 0 ? (
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
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${
                              client.status === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }`}
                          >
                            {client.status}
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

                        {/* Visit Info */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200">
                            <i className="ri-scissors-2-line"></i>
                            {client.visits} visits
                          </span>
                          <span className="flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-pink-200">
                            <i className="ri-wallet-3-line"></i>
                            {client.spent} spent
                          </span>
                          <span className="flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200">
                            <i className="ri-calendar-line"></i>
                            Last visit: {client.lastVisit}
                          </span>
                        </div>

                        {/* Upcoming Appointment */}
                        {client.upcomingAppointment && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Next:</span>
                            <span className="font-semibold text-gray-900">
                              {client.upcomingAppointment}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 shadow-sm font-medium text-sm"
                        title="Call Client"
                      >
                        <i className="ri-phone-line"></i>
                        Call
                      </button>
                      <button
                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border-2 border-blue-200 hover:border-blue-500 shadow-sm"
                        title="Send Email"
                      >
                        <i className="ri-mail-line text-lg"></i>
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
              ))}
            </div>
          )}
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistClients;