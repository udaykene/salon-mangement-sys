import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useBranch } from "../context/BranchContext";
import axios from "axios";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistStaff = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { user } = useAuth();
  const { branches } = useBranch();
  // Initialize with "all" to default to showing all branches as requested
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to generate consistent avatar for staff (since backend might not have it)
  const getAvatar = (name) => name ? name.charAt(0).toUpperCase() : "?";

  // Helper to get consistent gradient based on name length or char code
  const getGradient = (name) => {
    const gradients = [
      "from-rose-500 to-pink-500",
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-pink-500 to-fuchsia-500",
      "from-orange-500 to-red-500"
    ];
    if (!name) return gradients[0];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  useEffect(() => {
    const fetchStaffAvailability = async () => {
      try {
        setLoading(true);
        // TL Request: Remove branch filter, show only own branch.
        // We don't send branchId, enabling backend to default/enforce session branch.
        let url = "/api/staff/availability";

        const res = await axios.get(url, { withCredentials: true });

        // Transform data to match UI requirements if necessary
        const mappedStaff = res.data.map(s => ({
          ...s,
          id: s._id, // Map _id to id
          role: s.roleTitle || s.role || "Staff", // Use roleTitle if available, fallback to role, then "Staff"
          status: s.currentStatus || "available", // Default
          avatar: getAvatar(s.name),
          gradient: getGradient(s.name)
        }));

        setStaff(mappedStaff);
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStaffAvailability();

      // Optional: Poll every minute for real-time updates
      const interval = setInterval(fetchStaffAvailability, 60000);
      return () => clearInterval(interval);
    }
  }, [user, selectedBranch]); // Re-fetch when branch selection changes

  const roles = [
    "all",
    "Receptionist",
    "Stylist",
    "Hair Stylist", // Legacy support
    "Makeup Artist",
    "Spa Therapist",
    "Massage Therapist", // Legacy support
    "Barber",
    "Nail Technician",
    "Bridal Specialist",
    "Manager",
    "Assistant",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "busy":
        return "bg-red-100 text-red-700 border-red-200";
      case "on-break":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "off-duty":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return "ri-checkbox-circle-line";
      case "busy":
        return "ri-user-follow-line";
      case "on-break":
        return "ri-time-line";
      case "off-duty":
        return "ri-close-circle-line";
      default:
        return "ri-information-line";
    }
  };

  const filtered = staff.filter((member) => {
    const matchStatus = filterStatus === "all" || member.status === filterStatus;
    const matchRole = filterRole === "all" || member.role === filterRole;
    const matchSearch =
      searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchStatus && matchRole && matchSearch;
  });

  const counts = staff.reduce(
    (acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1;
      return acc;
    },
    { available: 0, busy: 0, "on-break": 0, "off-duty": 0 }
  );

  return (
    <ReceptionistLayout>
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Staff Availability
          </h1>
          <p className="text-gray-600">
            Real-time staff status and schedules
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Available */}
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
              Available Now
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.available}
            </p>
            <p className="text-xs text-gray-500 mt-2">Staff members free</p>
          </div>

          {/* Busy */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-follow-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Occupied
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Currently Busy
            </h3>
            <p className="text-3xl font-bold text-gray-900">{counts.busy}</p>
            <p className="text-xs text-gray-500 mt-2">With clients</p>
          </div>

          {/* On Break */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Break
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              On Break
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts["on-break"]}
            </p>
            <p className="text-xs text-gray-500 mt-2">Temporary away</p>
          </div>

          {/* Off Duty */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-500/5 border border-gray-100 hover:shadow-xl hover:shadow-gray-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-close-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                Away
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Off Duty
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts["off-duty"]}
            </p>
            <p className="text-xs text-gray-500 mt-2">Not working today</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Status Filter Pills */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["all", "available", "busy", "on-break", "off-duty"].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all capitalize ${filterStatus === s
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                        : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                        }`}
                    >
                      {s === "on-break" ? "On Break" : s}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

              {/* Branch Filter (Restored) */}
              {/* Branch Filter Removed per TL Request */}

              {/* Role Filter */}
              <div className="w-full lg:w-auto">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Filter by Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full lg:w-64 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === "all" ? "All Roles" : role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="w-full lg:w-auto lg:flex-1 lg:max-w-md">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Search Staff
                </label>
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, role, or skill..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                No staff members found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            filtered.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-rose-200 transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize flex items-center gap-1 ${getStatusColor(member.status)}`}
                    >
                      <i className={`${getStatusIcon(member.status)}`}></i>
                      {member.status === "on-break"
                        ? "On Break"
                        : member.status === "off-duty"
                          ? "Off Duty"
                          : member.status}
                    </span>
                  </div>

                  {/* Specializations */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">
                      Specialization
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.specialization.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Next Available
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {member.nextAvailable}
                        </p>
                      </div>
                      {member.currentClient && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Current Client
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {member.currentClient}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <i className="ri-time-line text-rose-500"></i>
                        Working Hours
                      </span>
                      <span className="font-bold text-gray-900">
                        {member.workingHours.start} -{" "}
                        {member.workingHours.end}
                      </span>
                    </div>
                  </div>

                  {/* Working Days */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">
                      Working Days
                    </p>
                    <div className="flex gap-1.5">
                      {weekDays.map((day) => (
                        <span
                          key={day}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${member.workingDays.includes(day)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-400"
                            }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <i className="ri-phone-line text-rose-500"></i>
                        {member.phone}
                      </span>
                      <button className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 shadow-sm font-medium text-sm">
                        <i className="ri-phone-line"></i>
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistStaff;