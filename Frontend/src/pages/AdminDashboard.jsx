import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminLayout from "../components/AdminLayout";
import { useBranch } from "../context/BranchContext";
import axios from "axios";

const AdminDashboard = () => {
  const { currentBranch } = useBranch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalRevenue: 0,
    activeClients: 0,
    staffMembers: 0,
    activeStaffForToday: 0, // Added to track staff on duty
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentBranch) return;

      try {
        setLoading(true);
        // Fetch report summary for the current branch
        const response = await axios.get(
          `/api/reports/summary?branchId=${currentBranch._id}&period=month`
        );
        const data = response.data;

        // Update Stats
        setStats({
          todayAppointments: data.todayStats?.total || 0,
          totalRevenue: data.totalRevenue || 0,
          activeClients: data.activeClients || 0, // Using total active clients
          staffMembers: data.activeStaff || 0,
          activeStaffForToday: data.activeStaff || 0, // Approximation for now
        });

        // Update Recent Appointments
        const formattedRecent = (data.recentTransactions || []).slice(0, 4).map((app) => ({
          id: app.id,
          client: app.client,
          service: app.service,
          time: app.time || "N/A", // Ensure time is handled
          status: app.status?.toLowerCase() || "pending",
          stylist: app.stylist || "Assigned Staff",
        }));
        setRecentAppointments(formattedRecent);

        // Update Top Services (Transforming serviceRevenue map to array)
        if (data.serviceRevenue) {
          const servicesArray = Object.entries(data.serviceRevenue).map(([name, revenue]) => ({
            name,
            revenue,
            bookings: 0, // Note: Bookings count per service might need a separate aggregation if critical
            trend: "N/A" // Trend calculation would need historical service breakdown
          }));
          // Sort by revenue descending
          servicesArray.sort((a, b) => b.revenue - a.revenue);
          setTopServices(servicesArray.slice(0, 4));
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentBranch]);


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

  if (loading && !stats.totalRevenue) { // Only show loading if initial load
    return (
      <AdminLayout>
        <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </main>
      </AdminLayout>
    )
  }

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
            Welcome back! Here's what's happening today at <span className="font-semibold text-rose-600">{currentBranch?.name}</span>.
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
                Today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Today's Appointments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.todayAppointments}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Scheduled for today
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-pink-500/5 border border-pink-100 hover:shadow-xl hover:shadow-pink-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-money-rupee-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Month
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
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activeClients}
            </p>
            <p className="text-xs text-gray-500 mt-2">Total registered</p>
          </div>

          {/* Staff Members */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Staff Members
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.staffMembers}
            </p>
            <p className="text-xs text-gray-500 mt-2">{stats.activeStaffForToday} active staff</p>
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
                  Recent Activity
                </h2>
                <button className="text-sm text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1">
                  View All
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentAppointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent appointments found.</div>
              ) : (
                recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-6 hover:bg-rose-50/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-200">
                          {appointment.client ? appointment.client.charAt(0) : "?"}
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
                ))
              )}
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
                By Revenue (This Month)
              </p>
            </div>
            <div className="p-6 space-y-6">
              {topServices.length === 0 ? (
                <div className="text-center text-gray-500">No service data available.</div>
              ) : (
                topServices.map((service, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      {/* Trend badge removed as we don't have historical data for trend yet */}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      {/* <span>{service.bookings} bookings</span> */}
                      {/* Booking count hidden as we only have revenue sum in this iteration */}
                      <span>Revenue</span>
                      <span className="font-semibold text-gray-900">
                        ₹{service.revenue.toLocaleString()}
                      </span>
                    </div>
                    {/* Progress bar normalized to max revenue in list or arbitrary max if single */}
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 group-hover:from-rose-600 group-hover:to-pink-600"
                        style={{ width: `${(service.revenue / (topServices[0]?.revenue || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
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