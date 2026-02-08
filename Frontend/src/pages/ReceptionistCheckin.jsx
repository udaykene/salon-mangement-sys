import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistCheckIn = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      appointment: "10:00 AM - Hair Styling",
      status: "checked-in",
      checkInTime: "09:55 AM",
      stylist: "Emma Williams",
      service: "Hair Styling & Color",
      duration: "90 mins",
      avatar: "S",
    },
    {
      id: 2,
      name: "Emily Davis",
      appointment: "11:30 AM - Hair Coloring",
      status: "waiting",
      checkInTime: "11:25 AM",
      stylist: "Lisa Anderson",
      service: "Hair Coloring",
      duration: "120 mins",
      avatar: "E",
    },
    {
      id: 3,
      name: "Lisa Morgan",
      appointment: "02:00 PM - Spa Treatment",
      status: "expected",
      checkInTime: null,
      stylist: "Maria Garcia",
      service: "Spa Treatment",
      duration: "60 mins",
      avatar: "L",
    },
    {
      id: 4,
      name: "Jessica Wright",
      appointment: "03:30 PM - Nail Art",
      status: "expected",
      checkInTime: null,
      stylist: "John Smith",
      service: "Nail Art",
      duration: "45 mins",
      avatar: "J",
    },
    {
      id: 5,
      name: "Anna Klein",
      appointment: "09:30 AM - Hair Styling",
      status: "completed",
      checkInTime: "09:25 AM",
      checkOutTime: "11:00 AM",
      stylist: "Emma Williams",
      service: "Hair Styling",
      duration: "90 mins",
      avatar: "A",
    },
  ]);

  const handleCheckIn = (id) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "checked-in", checkInTime: time }
          : c
      )
    );
  };

  const handleCheckOut = (id) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "completed", checkOutTime: time }
          : c
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-700 border-green-200";
      case "waiting":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "expected":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filtered = clients.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.stylist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = clients.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    { "checked-in": 0, waiting: 0, expected: 0, completed: 0 }
  );

  return (
    <ReceptionistLayout>
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Check In / Check Out
          </h1>
          <p className="text-gray-600">
            Manage client arrivals and departures
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Checked In */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-login-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Checked In
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts["checked-in"]}
            </p>
            <p className="text-xs text-gray-500 mt-2">Currently in facility</p>
          </div>

          {/* Waiting */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Priority
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Waiting</h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.waiting}
            </p>
            <p className="text-xs text-gray-500 mt-2">In waiting area</p>
          </div>

          {/* Expected */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-calendar-check-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Expected</h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.expected}
            </p>
            <p className="text-xs text-gray-500 mt-2">Not yet arrived</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-500/5 border border-gray-100 hover:shadow-xl hover:shadow-gray-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                Done
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Completed
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.completed}
            </p>
            <p className="text-xs text-gray-500 mt-2">Checked out today</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {["all", "checked-in", "waiting", "expected", "completed"].map(
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
                    {s === "checked-in"
                      ? "Checked In"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Search Box */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, service, or stylist..."
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
                <i className="ri-user-follow-line text-rose-600"></i>
                Client Status ({filtered.length})
              </h2>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-inbox-line text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                No clients match your filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((client) => (
                <div
                  key={client.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Client Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
                        {client.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {client.name}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(client.status)}`}
                          >
                            {client.status === "checked-in"
                              ? "Checked In"
                              : client.status.charAt(0).toUpperCase() +
                                client.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {client.service}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <i className="ri-time-line text-rose-500"></i>
                            {client.appointment}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-scissors-2-line text-rose-500"></i>
                            {client.stylist}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-timer-line text-rose-500"></i>
                            {client.duration}
                          </span>
                        </div>

                        {client.checkInTime && (
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="ri-login-circle-line text-green-500"></i>
                              Checked in: {client.checkInTime}
                            </span>
                            {client.checkOutTime && (
                              <span className="flex items-center gap-1">
                                <i className="ri-logout-circle-line text-blue-500"></i>
                                Checked out: {client.checkOutTime}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {client.status === "expected" && (
                        <button
                          onClick={() => handleCheckIn(client.id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-green-500/30 font-medium text-sm"
                        >
                          <i className="ri-login-circle-line text-lg"></i>
                          Check In
                        </button>
                      )}
                      {(client.status === "checked-in" ||
                        client.status === "waiting") && (
                        <button
                          onClick={() => handleCheckOut(client.id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 font-medium text-sm"
                        >
                          <i className="ri-logout-circle-line text-lg"></i>
                          Check Out
                        </button>
                      )}
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

export default ReceptionistCheckIn;