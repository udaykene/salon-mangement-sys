import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const SalonAdminClients = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [clients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      location: "Downtown",
      visits: 14,
      spent: "$1,240",
      avatar: "S",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 234-5678",
      status: "active",
      location: "Midtown",
      visits: 8,
      spent: "$680",
      avatar: "E",
      gradient: "from-pink-500 to-fuchsia-500",
    },
    {
      id: 3,
      name: "Lisa Morgan",
      email: "lisa.m@email.com",
      phone: "+1 (555) 345-6789",
      status: "inactive",
      location: "Westside",
      visits: 3,
      spent: "$310",
      avatar: "L",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      name: "Jessica Wright",
      email: "jessica.w@email.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      location: "Eastend",
      visits: 21,
      spent: "$2,100",
      avatar: "J",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 5,
      name: "Anna Klein",
      email: "anna.k@email.com",
      phone: "+1 (555) 567-8901",
      status: "active",
      location: "Uptown",
      visits: 6,
      spent: "$520",
      avatar: "A",
      gradient: "from-rose-400 to-pink-400",
    },
    {
      id: 6,
      name: "Maria Santos",
      email: "maria.s@email.com",
      phone: "+1 (555) 678-9012",
      status: "inactive",
      location: "Harbor",
      visits: 2,
      spent: "$180",
      avatar: "M",
      gradient: "from-pink-400 to-fuchsia-400",
    },
  ]);

  // ── derived ──────────────────────────────────
  const counts = clients.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { active: 0, inactive: 0 },
  );

  const filtered = clients.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalSpent = clients.reduce((sum, c) => {
    return sum + Number(c.spent.replace(/[$,]/g, ""));
  }, 0);

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
            <p className="text-3xl font-bold text-gray-900">
              {clients.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Registered users</p>
          </div>

          {/* Active Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-heart-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +{Math.floor((counts.active / clients.length) * 100)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.active}
            </p>
            <p className="text-xs text-gray-500 mt-2">Regular visitors</p>
          </div>

          {/* Inactive Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-unfollow-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Inactive
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Inactive Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.inactive}
            </p>
            <p className="text-xs text-gray-500 mt-2">Need attention</p>
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
              <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2">
                <i className="ri-user-add-line text-lg"></i>
                New Client
              </button>
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
                      <button
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
      </main>
    </AdminLayout>
  );
};

export default SalonAdminClients;