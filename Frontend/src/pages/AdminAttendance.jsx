import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import { useBranch } from "../context/BranchContext.jsx";
import axios from "axios";
import Toast from "../components/Toast";

const api = axios.create({
  baseURL: "/api/attendance",
  withCredentials: true,
});

const AdminAttendance = () => {
  const { branches } = useBranch();

  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (message, type = "success") => setToast({ message, type });

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = { date: selectedDate };
      if (selectedBranch !== "all") params.branchId = selectedBranch;

      console.log("DEBUG: AdminAttendance fetching with params:", params);
      const res = await api.get("/", { params });
      console.log("DEBUG: AdminAttendance received data:", res.data);

      setStaffList(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      showToast(
        err.response?.data?.message || "Error fetching attendance",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("DEBUG: AdminAttendance branches from context:", branches);
    fetchAttendance();
  }, [selectedDate, selectedBranch, branches]);

  // Filter staff based on search query
  const filteredStaffList = useMemo(() => {
    if (!searchQuery.trim()) return staffList;

    const query = searchQuery.toLowerCase();
    return staffList.filter(
      (staff) =>
        staff.name?.toLowerCase().includes(query) ||
        staff.phone?.toLowerCase().includes(query)
    );
  }, [staffList, searchQuery]);

  // Mark single staff attendance
  const markAttendance = async (staffId, status) => {
    try {
      setMarkingId(staffId);
      await api.post("/mark", { staffId, date: selectedDate, status });
      setStaffList((prev) =>
        prev.map((s) => (s._id === staffId ? { ...s, attendance: status } : s)),
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Error marking attendance",
        "error",
      );
    } finally {
      setMarkingId(null);
    }
  };

  // Bulk mark all
  const markAll = async (status) => {
    try {
      setBulkLoading(true);
      const records = filteredStaffList.map((s) => ({ staffId: s._id, status }));
      await api.post("/mark-bulk", { date: selectedDate, records });
      setStaffList((prev) =>
        prev.map((s) => {
          const isInFiltered = filteredStaffList.find(f => f._id === s._id);
          return isInFiltered ? { ...s, attendance: status } : s;
        })
      );
      showToast(`${filteredStaffList.length} staff marked as ${status}`, "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Error marking attendance",
        "error",
      );
    } finally {
      setBulkLoading(false);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = staffList.length;
    const present = staffList.filter((s) => s.attendance === "present").length;
    const absent = staffList.filter((s) => s.attendance === "absent").length;
    const unmarked = total - present - absent;
    return { total, present, absent, unmarked };
  }, [staffList]);

  // Get branch name
  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch ? branch.name : "Unknown";
  };

  // Format display date
  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = selectedDate === todayStr;

  // Loading state
  if (loading && staffList.length === 0) {
    return (
      <AdminLayout>
        <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading attendance...</p>
          </div>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header with Date & Branch Selection */}
        <div className="mb-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Attendance Management
              </h1>
              <p className="text-gray-600 text-sm">
                Track and manage daily staff attendance
              </p>
            </div>

            {/* Date Picker & Branch Switcher - Inline with Header */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {/* Date Picker */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  <i className="ri-calendar-line mr-1"></i>
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white text-sm"
                />
                {isToday && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">
                    📅 Today
                  </p>
                )}
              </div>

              {/* Branch Switcher */}
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  <i className="ri-building-line mr-1"></i>
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white text-sm min-w-[180px]"
                >
                  <option value="all">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Staff */}
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
              Total Staff
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">All employees</p>
          </div>

          {/* Present */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Present Today
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.present}
            </p>
            <p className="text-xs text-gray-500 mt-2">Checked in</p>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-close-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Absent
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Absent Today
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.absent}
            </p>
            <p className="text-xs text-gray-500 mt-2">Not available</p>
          </div>

          {/* Unmarked */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-question-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Unmarked
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.unmarked}
            </p>
            <p className="text-xs text-gray-500 mt-2">Needs update</p>
          </div>
        </div>

        {/* Search & Quick Actions */}
        {staffList.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search by name or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => markAll("present")}
                disabled={bulkLoading || filteredStaffList.length === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-checkbox-circle-line"></i>
                Mark All Present
              </button>
              <button
                onClick={() => markAll("absent")}
                disabled={bulkLoading || filteredStaffList.length === 0}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-close-circle-line"></i>
                Mark All Absent
              </button>
            </div>
          </div>
        )}

        {/* Staff Attendance List */}
        {filteredStaffList.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <i className="ri-search-line text-rose-500 text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No Results Found" : "No Staff Found"}
            </h2>
            <p className="text-gray-600 text-center max-w-md text-sm">
              {searchQuery ? (
                <>
                  No staff members match your search "{searchQuery}".
                  <br />
                  Try searching with a different name or mobile number.
                </>
              ) : selectedBranch !== "all" ? (
                `No staff members found for branch: ${getBranchName(selectedBranch)}.`
              ) : (
                "No staff members found in the entire organization."
              )}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <i className="ri-team-line text-rose-600"></i>
                  Staff List — {formatDisplayDate(selectedDate)}
                </h2>
                <span className="text-xs text-gray-600">
                  Showing {filteredStaffList.length} of {staffList.length}
                </span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                      Staff Member
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                      Branch
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaffList.map((member) => {
                    console.log(
                      "DEBUG: AdminAttendance mapping member:",
                      member.name,
                    );
                    return (
                      <tr
                        key={member._id}
                        className="border-b border-gray-100 hover:bg-rose-50/30 transition-colors"
                      >
                        {/* Name & Avatar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-semibold border border-rose-200 text-sm flex-shrink-0">
                              {member.name ? member.name.charAt(0) : "S"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {member.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {member.phone || "No Phone"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                            {member.role || "Staff"}
                          </span>
                        </td>

                        {/* Branch */}
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            {getBranchName(member.branchId)}
                          </span>
                        </td>

                        {/* Staff Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${(member.status || member.staffStatus) === "active"
                                ? "bg-green-50 text-green-700"
                                : (member.status || member.staffStatus) ===
                                  "on-leave"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                          >
                            {(member.status || member.staffStatus) ===
                              "on-leave"
                              ? "On Leave"
                              : (
                                member.status ||
                                member.staffStatus ||
                                "Active"
                              )
                                .charAt(0)
                                .toUpperCase() +
                              (
                                member.status ||
                                member.staffStatus ||
                                "active"
                              ).slice(1)}
                          </span>
                        </td>

                        {/* Attendance Toggle */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                markAttendance(member._id, "present")
                              }
                              disabled={markingId === member._id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${member.attendance === "present"
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                                } disabled:opacity-50`}
                            >
                              <i className="ri-checkbox-circle-line mr-1"></i>
                              Present
                            </button>
                            <button
                              onClick={() =>
                                markAttendance(member._id, "absent")
                              }
                              disabled={markingId === member._id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${member.attendance === "absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
                                } disabled:opacity-50`}
                            >
                              <i className="ri-close-circle-line mr-1"></i>
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminAttendance;