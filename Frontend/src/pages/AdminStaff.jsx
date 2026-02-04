import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const AdminStaff = () => {
  const [staff] = useState([
    {
      id: 1,
      name: "Emma Williams",
      email: "emma@beautysalon.com",
      phone: "+91 9876543210",
      role: "Senior Stylist",
      department: "Hair Services",
      status: "active",
      joinDate: "Jan 2023",
      salary: "₹85,000",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@beautysalon.com",
      phone: "+91 9123456780",
      role: "Makeup Artist",
      department: "Makeup",
      status: "active",
      joinDate: "Mar 2022",
      salary: "₹92,000",
    },
    {
      id: 3,
      name: "Lisa Anderson",
      email: "lisa@beautysalon.com",
      phone: "+91 9988776655",
      role: "Spa Therapist",
      department: "Spa & Wellness",
      status: "active",
      joinDate: "Jul 2023",
      salary: "₹65,000",
    },
    {
      id: 4,
      name: "Maria Garcia",
      email: "maria@beautysalon.com",
      phone: "+91 9445566778",
      role: "Bridal Specialist",
      department: "Makeup",
      status: "active",
      joinDate: "Feb 2021",
      salary: "₹78,000",
    },
    {
      id: 5,
      name: "John Smith",
      email: "john@beautysalon.com",
      phone: "+91 9334455667",
      role: "Barber",
      department: "Hair Services",
      status: "on-leave",
      joinDate: "Sep 2023",
      salary: "₹58,000",
    },
    {
      id: 6,
      name: "Anjali Verma",
      email: "anjali@beautysalon.com",
      phone: "+91 9223344556",
      role: "Nail Technician",
      department: "Nail Art",
      status: "active",
      joinDate: "Nov 2022",
      salary: "₹72,000",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const departments = [
    "all",
    "Hair Services",
    "Makeup",
    "Spa & Wellness",
    "Nail Art",
  ];

  const getStatusStyles = (status) => {
    if (status === "active")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "on-leave")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (status === "inactive") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getRoleIcon = (role) => {
    if (role.includes("Stylist")) return "ri-scissors-line";
    if (role.includes("Makeup") || role.includes("Bridal")) return "ri-paint-brush-line";
    if (role.includes("Spa") || role.includes("Therapist")) return "ri-hand-heart-line";
    if (role.includes("Nail")) return "ri-hand-sanitizer-line";
    return "ri-user-line";
  };

  const filteredStaff = staff.filter((m) => {
    return (
      (filterStatus === "all" || m.status === filterStatus) &&
      (filterDepartment === "all" || m.department === filterDepartment)
    );
  });

  return (
    <AdminLayout>
      {/* Main Content */}
      <main className="bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600">
            Manage and track all staff members
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Staff */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                All members
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Staff
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {staff.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Across all departments
            </p>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-pink-500/5 border border-pink-100 hover:shadow-xl hover:shadow-pink-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-follow-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                On duty
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Staff
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {staff.filter((s) => s.status === "active").length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Working today
            </p>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Unavailable
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              On Leave
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {staff.filter((s) => s.status === "on-leave").length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Currently away
            </p>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-building-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Departments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              4
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All operational
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="ri-filter-line text-rose-600"></i>
              Filter Staff
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {["all", "active", "on-leave", "inactive"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      filterStatus === s
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {s === "all"
                      ? "All Status"
                      : s === "on-leave"
                      ? "On Leave"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Department
              </label>
              <div className="flex gap-2 flex-wrap">
                {departments.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDepartment(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      filterDepartment === d
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {d === "all" ? "All Departments" : d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-team-line text-purple-600"></i>
                Staff Members
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-rose-500/30 transition-all">
                <i className="ri-user-add-line"></i>
                Add Staff
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredStaff.map((member) => (
              <div
                key={member.id}
                className="p-6 hover:bg-rose-50/30 transition-colors group"
              >
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  {/* Left Section - Staff Info */}
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-200 text-xl flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          {member.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(member.status)}`}
                        >
                          {member.status === "on-leave" 
                            ? "On Leave"
                            : member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        {member.role}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <i className="ri-mail-line text-rose-500"></i>
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-phone-line text-rose-500"></i>
                          {member.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-building-line text-rose-500"></i>
                          {member.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Details & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 border-t sm:border-t-0 lg:border-t-0 lg:border-l border-gray-100 pt-3 sm:pt-0 lg:pl-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">
                        Joined:{" "}
                        <span className="font-semibold text-gray-700">
                          {member.joinDate}
                        </span>
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {member.salary}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110">
                        <i className="ri-mail-line"></i>
                      </button>
                      <button className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredStaff.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <i className="ri-user-search-line text-6xl text-gray-300 mb-4 block"></i>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Staff Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminStaff;