import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 12,
    totalRevenue: 45670,
    activeClients: 342,
    staffMembers: 15,
  });

  const [recentAppointments] = useState([
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Hair Styling & Color",
      time: "10:00 AM",
      status: "confirmed",
      stylist: "Emma Williams",
    },
    {
      id: 2,
      client: "Michael Brown",
      service: "Spa Massage",
      time: "11:30 AM",
      status: "pending",
      stylist: "Lisa Anderson",
    },
    {
      id: 3,
      client: "Jessica Davis",
      service: "Bridal Makeup",
      time: "02:00 PM",
      status: "confirmed",
      stylist: "Maria Garcia",
    },
    {
      id: 4,
      client: "David Wilson",
      service: "Haircut & Beard Trim",
      time: "03:30 PM",
      status: "completed",
      stylist: "John Smith",
    },
  ]);

  const [topServices] = useState([
    { name: "Hair Styling", bookings: 156, revenue: 18720, trend: "+12%" },
    { name: "Spa & Massage", bookings: 132, revenue: 15840, trend: "+8%" },
    { name: "Bridal Makeup", bookings: 89, revenue: 26700, trend: "+15%" },
    { name: "Nail Art", bookings: 98, revenue: 9800, trend: "+5%" },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <AdminLayout>
      {/* Main Content */}
      <main className=" min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-calendar-check-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +3 today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Today's Appointments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.todayAppointments}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              4 pending confirmations
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-pink-500/5 border border-pink-100 hover:shadow-xl hover:shadow-pink-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-money-rupee-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12% MTD
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>

          {/* Active Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-heart-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +8% growth
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activeClients}
            </p>
            <p className="text-xs text-gray-500 mt-2">25 new this week</p>
          </div>

          {/* Staff Members */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                All active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Staff Members
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.staffMembers}
            </p>
            <p className="text-xs text-gray-500 mt-2">12 on duty today</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-calendar-line text-rose-600"></i>
                  Today's Appointments
                </h2>
                <button className="text-sm text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1">
                  View All
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-200">
                        {appointment.client.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {appointment.client}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.service}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        appointment.status,
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line text-rose-500"></i>
                      {appointment.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-scissors-2-line text-rose-500"></i>
                      {appointment.stylist}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-star-line text-purple-600"></i>
                Top Services
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                This month's performance
              </p>
            </div>
            <div className="p-6 space-y-6">
              {topServices.map((service, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {service.trend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{service.bookings} bookings</span>
                    <span className="font-semibold text-gray-900">
                      ₹{service.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 group-hover:from-rose-600 group-hover:to-pink-600"
                      style={{ width: `${(service.bookings / 160) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-xl border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50 transition-all group flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-add-line text-white text-2xl"></i>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">New Appointment</p>
              <p className="text-xs text-gray-600">Book a slot</p>
            </div>
          </button>

          <button className="p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all group flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-user-add-line text-white text-2xl"></i>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Add Client</p>
              <p className="text-xs text-gray-600">New customer</p>
            </div>
          </button>

          <button className="p-4 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-file-chart-line text-white text-2xl"></i>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">View Reports</p>
              <p className="text-xs text-gray-600">Analytics</p>
            </div>
          </button>

          <button className="p-4 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 transition-all group flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-settings-3-line text-white text-2xl"></i>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Settings</p>
              <p className="text-xs text-gray-600">Configure</p>
            </div>
          </button>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;