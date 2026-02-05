import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const AdminWalkIn = () => {
  const [stats, setStats] = useState({
    todayWalkIns: 18,
    activeNow: 5,
    waiting: 3,
    avgWaitTime: 15,
  });

  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [walkInCustomers] = useState([
    {
      id: 1,
      tokenNumber: "W-001",
      customerName: "Priya Sharma",
      phoneNumber: "+91 98765 43210",
      service: "Hair Styling & Color",
      preferredStylist: "Emma Williams",
      checkInTime: "09:30 AM",
      estimatedDuration: "90 min",
      status: "in-service",
      waitTime: 0,
      notes: "Allergic to certain hair dyes",
    },
    {
      id: 2,
      tokenNumber: "W-002",
      customerName: "Amit Patel",
      phoneNumber: "+91 98123 45678",
      service: "Haircut & Beard Trim",
      preferredStylist: "John Smith",
      checkInTime: "10:00 AM",
      estimatedDuration: "45 min",
      status: "in-service",
      waitTime: 0,
      notes: "",
    },
    {
      id: 3,
      tokenNumber: "W-003",
      customerName: "Neha Gupta",
      phoneNumber: "+91 97654 32109",
      service: "Bridal Makeup",
      preferredStylist: "Maria Garcia",
      checkInTime: "10:15 AM",
      estimatedDuration: "120 min",
      status: "waiting",
      waitTime: 12,
      notes: "Wedding at 2 PM today",
    },
    {
      id: 4,
      tokenNumber: "W-004",
      customerName: "Rahul Verma",
      phoneNumber: "+91 96543 21098",
      service: "Spa Massage",
      preferredStylist: "Lisa Anderson",
      checkInTime: "10:30 AM",
      estimatedDuration: "60 min",
      status: "waiting",
      waitTime: 8,
      notes: "Requested deep tissue massage",
    },
    {
      id: 5,
      tokenNumber: "W-005",
      customerName: "Sneha Reddy",
      phoneNumber: "+91 95432 10987",
      service: "Nail Art & Manicure",
      preferredStylist: "Any Available",
      checkInTime: "10:45 AM",
      estimatedDuration: "60 min",
      status: "waiting",
      waitTime: 3,
      notes: "",
    },
    {
      id: 6,
      tokenNumber: "W-006",
      customerName: "Vikram Singh",
      phoneNumber: "+91 94321 09876",
      service: "Hair Spa Treatment",
      preferredStylist: "Emma Williams",
      checkInTime: "09:00 AM",
      estimatedDuration: "75 min",
      status: "in-service",
      waitTime: 0,
      notes: "Regular customer - VIP",
    },
    {
      id: 7,
      tokenNumber: "W-007",
      customerName: "Ananya Iyer",
      phoneNumber: "+91 93210 98765",
      service: "Facial & Cleanup",
      preferredStylist: "Maria Garcia",
      checkInTime: "08:45 AM",
      estimatedDuration: "90 min",
      status: "completed",
      waitTime: 0,
      notes: "",
    },
    {
      id: 8,
      tokenNumber: "W-008",
      customerName: "Karan Malhotra",
      phoneNumber: "+91 92109 87654",
      service: "Hair Color",
      preferredStylist: "John Smith",
      checkInTime: "08:30 AM",
      estimatedDuration: "120 min",
      status: "in-service",
      waitTime: 0,
      notes: "Wants dark brown shade",
    },
  ]);

  const [availableStylists] = useState([
    {
      id: 1,
      name: "Emma Williams",
      specialization: "Hair Styling",
      status: "busy",
      currentCustomer: "Priya Sharma",
      availableIn: "45 min",
    },
    {
      id: 2,
      name: "John Smith",
      specialization: "Hair & Beard",
      status: "busy",
      currentCustomer: "Amit Patel",
      availableIn: "30 min",
    },
    {
      id: 3,
      name: "Maria Garcia",
      specialization: "Makeup & Facial",
      status: "available",
      currentCustomer: null,
      availableIn: "Now",
    },
    {
      id: 4,
      name: "Lisa Anderson",
      specialization: "Spa & Massage",
      status: "available",
      currentCustomer: null,
      availableIn: "Now",
    },
    {
      id: 5,
      name: "Sophie Chen",
      specialization: "Nail Art",
      status: "available",
      currentCustomer: null,
      availableIn: "Now",
    },
  ]);

  const [popularServices] = useState([
    { name: "Haircut & Styling", walkIns: 42, avgTime: "45 min" },
    { name: "Hair Color", walkIns: 28, avgTime: "90 min" },
    { name: "Bridal Makeup", walkIns: 15, avgTime: "120 min" },
    { name: "Spa & Massage", walkIns: 35, avgTime: "60 min" },
  ]);

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
            <p className="text-3xl font-bold text-gray-900">{stats.activeNow}</p>
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
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              In Queue
            </h3>
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
                <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all flex items-center gap-2">
                  <i className="ri-add-line"></i>
                  Add Walk-In
                </button>
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
                        customer.status
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
                        <p className="text-xs text-yellow-600 mb-1">Wait Time</p>
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
                    {customer.status === "waiting" && (
                      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all text-sm flex items-center justify-center gap-2">
                        <i className="ri-play-line"></i>
                        Start Service
                      </button>
                    )}
                    {customer.status === "in-service" && (
                      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all text-sm flex items-center justify-center gap-2">
                        <i className="ri-check-line"></i>
                        Mark Complete
                      </button>
                    )}
                    <button className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-600 rounded-lg font-semibold hover:border-gray-400 transition-all text-sm">
                      <i className="ri-edit-line"></i>
                    </button>
                    <button className="px-3 py-2 bg-white border-2 border-red-200 text-red-600 rounded-lg font-semibold hover:border-red-400 transition-all text-sm">
                      <i className="ri-close-line"></i>
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
                <p className="text-sm text-gray-600 mt-1">Real-time availability</p>
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
                          stylist.status
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
                <button className="w-full p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                  <i className="ri-notification-line"></i>
                  Call Next
                </button>
                <button className="w-full p-3 bg-white border-2 border-purple-200 text-purple-600 rounded-lg font-semibold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
                  <i className="ri-refresh-line"></i>
                  Refresh Queue
                </button>
                <button className="w-full p-3 bg-white border-2 border-blue-200 text-blue-600 rounded-lg font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  <i className="ri-printer-line"></i>
                  Print Tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminWalkIn;