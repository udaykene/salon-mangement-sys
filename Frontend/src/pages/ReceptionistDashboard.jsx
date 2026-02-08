import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 18,
    checkedIn: 12,
    waitingClients: 3,
    completedToday: 9,
  });

  const [upcomingAppointments] = useState([
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Hair Styling & Color",
      time: "10:00 AM",
      status: "confirmed",
      stylist: "Emma Williams",
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      client: "Michael Brown",
      service: "Spa Massage",
      time: "11:30 AM",
      status: "waiting",
      stylist: "Lisa Anderson",
      phone: "+91 98765 43211",
    },
    {
      id: 3,
      client: "Jessica Davis",
      service: "Bridal Makeup",
      time: "02:00 PM",
      status: "confirmed",
      stylist: "Maria Garcia",
      phone: "+91 98765 43212",
    },
    {
      id: 4,
      client: "David Wilson",
      service: "Haircut & Beard Trim",
      time: "03:30 PM",
      status: "pending",
      stylist: "John Smith",
      phone: "+91 98765 43213",
    },
  ]);

  const [staffAvailability] = useState([
    {
      name: "Emma Williams",
      role: "Hair Stylist",
      status: "busy",
      currentClient: "Sarah Johnson",
      nextAvailable: "11:00 AM",
    },
    {
      name: "Lisa Anderson",
      role: "Massage Therapist",
      status: "available",
      currentClient: null,
      nextAvailable: "Now",
    },
    {
      name: "Maria Garcia",
      role: "Makeup Artist",
      status: "available",
      currentClient: null,
      nextAvailable: "Now",
    },
    {
      name: "John Smith",
      role: "Barber",
      status: "break",
      currentClient: null,
      nextAvailable: "03:00 PM",
    },
  ]);

  const [recentCheckIns] = useState([
    {
      id: 1,
      client: "Sarah Johnson",
      time: "09:55 AM",
      service: "Hair Styling",
    },
    {
      id: 2,
      client: "Emily Roberts",
      time: "09:30 AM",
      service: "Manicure",
    },
    {
      id: 3,
      client: "John Doe",
      time: "09:15 AM",
      service: "Haircut",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStaffStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "busy":
        return "bg-red-100 text-red-700";
      case "break":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <ReceptionistLayout>
      {/* Main Content */}
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Front Desk Dashboard
          </h1>
          <p className="text-gray-600">
            Manage appointments, check-ins, and client services
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
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {stats.todayAppointments - stats.completedToday} pending
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Today's Appointments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.todayAppointments}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.completedToday} completed
            </p>
          </div>

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
              {stats.checkedIn}
            </p>
            <p className="text-xs text-gray-500 mt-2">Clients in facility</p>
          </div>

          {/* Waiting Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Priority
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Waiting Clients
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.waitingClients}
            </p>
            <p className="text-xs text-gray-500 mt-2">In waiting area</p>
          </div>

          {/* Completed Today */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                On track
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Completed Today
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.completedToday}
            </p>
            <p className="text-xs text-gray-500 mt-2">Services finished</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-calendar-line text-rose-600"></i>
                  Upcoming Appointments
                </h2>
                <button className="text-sm text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1">
                  View All
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.map((appointment) => (
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
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <i className="ri-phone-line"></i>
                          {appointment.phone}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line text-rose-500"></i>
                      {appointment.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-scissors-2-line text-rose-500"></i>
                      {appointment.stylist}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1">
                      <i className="ri-login-circle-line"></i>
                      Check In
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1">
                      <i className="ri-phone-line"></i>
                      Call
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors flex items-center gap-1">
                      <i className="ri-edit-line"></i>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Availability */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-team-line text-purple-600"></i>
                Staff Availability
              </h2>
              <p className="text-sm text-gray-600 mt-1">Current status</p>
            </div>
            <div className="p-6 space-y-4">
              {staffAvailability.map((staff, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-rose-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-200">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {staff.name}
                        </h3>
                        <p className="text-xs text-gray-600">{staff.role}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStaffStatusColor(
                        staff.status
                      )}`}
                    >
                      {staff.status.charAt(0).toUpperCase() +
                        staff.status.slice(1)}
                    </span>
                  </div>
                  {staff.currentClient && (
                    <p className="text-xs text-gray-600 mb-1">
                      <i className="ri-user-line text-rose-500"></i> With:{" "}
                      {staff.currentClient}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    <i className="ri-time-line text-rose-500"></i> Next
                    available: {staff.nextAvailable}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Check-ins & Quick Actions */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Check-ins */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-login-circle-line text-green-600"></i>
                Recent Check-ins
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentCheckIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="p-4 hover:bg-green-50/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-600 font-bold border-2 border-green-200">
                      {checkIn.client.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {checkIn.client}
                      </h3>
                      <p className="text-sm text-gray-600">{checkIn.service}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <i className="ri-time-line text-green-500"></i>
                    {checkIn.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-flashlight-line text-blue-600"></i>
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30">
                <i className="ri-add-circle-line text-xl"></i>
                Walk-in Client
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30">
                <i className="ri-calendar-check-line text-xl"></i>
                Book Appointment
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                <i className="ri-search-line text-xl"></i>
                Search Client
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                <i className="ri-logout-circle-line text-xl"></i>
                Check Out Client
              </button>
            </div>
          </div>
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistDashboard;