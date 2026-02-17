import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { useBranch } from "../context/BranchContext";

const AdminWalkIn = () => {
  const { currentBranch } = useBranch();
  const [stats, setStats] = useState({
    todayWalkIns: 0,
    activeNow: 0,
    waiting: 0,
    avgWaitTime: 0,
  });

  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  const [walkInCustomers, setWalkInCustomers] = useState([]);
  const [availableStylists, setAvailableStylists] = useState([]);

  const [popularServices] = useState([
    { name: "Haircut & Styling", walkIns: 42, avgTime: "45 min" },
    { name: "Hair Color", walkIns: 28, avgTime: "90 min" },
    { name: "Bridal Makeup", walkIns: 15, avgTime: "120 min" },
    { name: "Spa & Massage", walkIns: 35, avgTime: "60 min" },
  ]);

  const fetchWalkInData = useCallback(async () => {
    if (!currentBranch?._id) return;
    try {
      const [aptRes, staffRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/appointments?branchId=${currentBranch._id}`,
        ),
        axios.get(
          `http://localhost:3000/api/staff?branchId=${currentBranch._id}`,
        ),
      ]);

      const walkIns = aptRes.data.filter((a) => a.bookingType === "Walk-in");

      const formattedWalkIns = walkIns.map((a) => ({
        id: a._id,
        tokenNumber: "W-" + a._id.toString().slice(-3).toUpperCase(),
        customerName: a.customerName,
        phoneNumber: a.phone,
        service: a.service,
        preferredStylist: a.staff,
        checkInTime: a.time,
        estimatedDuration: "45 min", // Default or calculated
        status: a.status.toLowerCase(),
        waitTime: 0,
        notes: a.notes,
      }));

      setWalkInCustomers(formattedWalkIns);

      const today = new Date().toISOString().split("T")[0];
      const todayWalkIns = walkIns.filter((a) => a.date === today);

      setStats({
        todayWalkIns: todayWalkIns.length,
        activeNow: walkIns.filter((a) => a.status === "In-Progress").length,
        waiting: walkIns.filter((a) => a.status === "Confirmed").length, // Confirmed = Waiting in our logic
        avgWaitTime: 15,
      });

      const stylists = staffRes.data.map((s) => ({
        id: s._id,
        name: s.name,
        specialization: s.specialization?.join(", ") || "General",
        status: s.status === "active" ? "available" : "busy",
        currentCustomer: null,
        availableIn: "Now",
      }));
      setAvailableStylists(stylists);
    } catch (err) {
      console.error("Failed to fetch admin walk-in data", err);
    }
  }, [currentBranch]);

  useEffect(() => {
    fetchWalkInData();
  }, [fetchWalkInData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "in-service":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "in-service":
        return "ri-scissors-2-line";
      case "waiting":
        return "ri-time-line";
      case "completed":
        return "ri-check-line";
      case "cancelled":
        return "ri-close-line";
      default:
        return "ri-question-line";
    }
  };

  const getStylistStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "busy":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "break":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredCustomers = walkInCustomers.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" &&
        (customer.status === "in-service" || customer.status === "waiting")) ||
      (activeTab === "waiting" && customer.status === "waiting") ||
      (activeTab === "service" && customer.status === "in-service") ||
      (activeTab === "completed" && customer.status === "completed");

    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Walk-In Management
          </h1>
          <p className="text-gray-600">
            Manage walk-in customers and queue in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Walk-Ins */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-add-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +5 today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Today's Walk-Ins
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.todayWalkIns}
            </p>
            <p className="text-xs text-gray-500 mt-2">Since opening</p>
          </div>

          {/* Active Now */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-scissors-2-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                In Service
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Now
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activeNow}
            </p>
            <p className="text-xs text-gray-500 mt-2">Currently being served</p>
          </div>

          {/* Waiting Queue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                Waiting
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">In Queue</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.waiting}</p>
            <p className="text-xs text-gray-500 mt-2">Customers waiting</p>
          </div>

          {/* Avg Wait Time */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-timer-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                -3 min
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Avg Wait Time
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.avgWaitTime}
              <span className="text-lg text-gray-500 ml-1">min</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">Better than yesterday</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Walk-In List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-user-line text-rose-600"></i>
                  Walk-In Customers
                </h2>
                <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold">
                  View Only Mode
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by name, token, phone, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === "all"
                        ? "bg-rose-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === "active"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveTab("waiting")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === "waiting"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() => setActiveTab("service")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === "service"
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    In Service
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                      activeTab === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Cards */}
            <div className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-bold text-xl border-2 border-rose-200">
                        {customer.customerName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {customer.customerName}
                          </h3>
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded">
                            {customer.tokenNumber}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <i className="ri-phone-line text-rose-500 mr-1"></i>
                          {customer.phoneNumber}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          <i className="ri-scissors-line text-rose-500 mr-1"></i>
                          {customer.service}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                        customer.status,
                      )}`}
                    >
                      <i className={getStatusIcon(customer.status)}></i>
                      {customer.status.split("-").join(" ").toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Check-In</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {customer.checkInTime}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {customer.estimatedDuration}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Stylist</p>
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {customer.preferredStylist}
                      </p>
                    </div>
                    {customer.status === "waiting" && (
                      <div className="bg-yellow-50 p-2 rounded-lg">
                        <p className="text-xs text-yellow-600 mb-1">
                          Wait Time
                        </p>
                        <p className="font-bold text-yellow-700 text-sm">
                          {customer.waitTime} min
                        </p>
                      </div>
                    )}
                  </div>

                  {customer.notes && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">
                        <i className="ri-information-line mr-1"></i>
                        <strong>Note:</strong> {customer.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      disabled
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-400 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      Operation Restricted
                    </button>
                  </div>
                </div>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="p-12 text-center">
                  <i className="ri-user-search-line text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 font-semibold">
                    No customers found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Available Stylists */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-team-line text-purple-600"></i>
                  Staff Status
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time availability
                </p>
              </div>
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {availableStylists.map((stylist) => (
                  <div
                    key={stylist.id}
                    className="p-3 rounded-lg border-2 border-gray-100 hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 font-bold">
                          {stylist.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {stylist.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {stylist.specialization}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStylistStatusColor(
                          stylist.status,
                        )}`}
                      >
                        {stylist.status.toUpperCase()}
                      </span>
                    </div>
                    {stylist.currentCustomer ? (
                      <div className="text-xs bg-orange-50 p-2 rounded">
                        <p className="text-orange-600">
                          <i className="ri-user-line mr-1"></i>
                          Serving: {stylist.currentCustomer}
                        </p>
                        <p className="text-orange-500 mt-1">
                          <i className="ri-time-line mr-1"></i>
                          Available in: {stylist.availableIn}
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs bg-green-50 p-2 rounded">
                        <p className="text-green-600 font-semibold">
                          <i className="ri-check-line mr-1"></i>
                          Ready for next customer
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Services */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-star-line text-blue-600"></i>
                  Popular Today
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {popularServices.map((service, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {service.name}
                      </h3>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {service.walkIns} walk-ins
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>
                        <i className="ri-time-line text-blue-500 mr-1"></i>
                        Avg: {service.avgTime}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${(service.walkIns / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 space-y-3">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 italic">
                    Operations like "Call Next" and "Print Token" are managed by
                    the Receptionist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminWalkIn;
