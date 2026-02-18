import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import { useBranch } from "../context/BranchContext.jsx";
import axios from "axios";
import Toast from "../components/Toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const api = axios.create({
  baseURL: "/api/attendance",
  withCredentials: true,
});

const AdminAttendance = () => {
  const { branches } = useBranch();

  // Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  // Global State
  const [activeTab, setActiveTab] = useState("daily"); // "daily", "report", "calendar"
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Daily View State
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [staffList, setStaffList] = useState([]);
  const [markingId, setMarkingId] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Report View State
  const [reportType, setReportType] = useState("monthly"); // "weekly", "monthly", "yearly"
  const [reportDate, setReportDate] = useState(todayStr);
  const [reportStats, setReportStats] = useState(null);

  // Calendar View State
  const [calendarStaffId, setCalendarStaffId] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(todayStr.slice(0, 7)); // YYYY-MM
  const [calendarData, setCalendarData] = useState(null);
  const [allStaff, setAllStaff] = useState([]); // For staff selector in calendar

  const showToast = (message, type = "success") => setToast({ message, type });

  // --- Data Fetching ---

  // Fetch Full Staff List (for Calendar Selector)
  useEffect(() => {
    // We can use the existing /api/staff or just fetch attendance with a dummy date to get staff list?
    // Better to have a unified staff fetch. For now, we'll assume fetchAttendance populates staffList
    // but strict separation is better.
    // Let's rely on fetchAttendance("daily") running at least once or implement a specific fetch.
    // simpler: fetch daily for today to populate staff list if empty.
    if (activeTab === "calendar" && allStaff.length === 0) {
      fetchAttendance();
    }
  }, [activeTab]);

  // Fetch Attendance for Daily View
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = { date: selectedDate };
      if (selectedBranch !== "all") params.branchId = selectedBranch;

      const res = await api.get("/", { params });
      setStaffList(res.data);
      if (allStaff.length === 0) setAllStaff(res.data); // Cache for calendar dropdown
    } catch (err) {
      console.error("Error fetching attendance:", err);
      showToast(
        err.response?.data?.message || "Error fetching attendance",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Report Stats
  const fetchReportStats = async () => {
    try {
      setLoading(true);
      let startDate, endDate;
      const dateObj = new Date(reportDate);

      if (reportType === "weekly") {
        // Start of week (Sunday)
        const day = dateObj.getDay();
        const diff = dateObj.getDate() - day;
        const start = new Date(dateObj.setDate(diff));
        const end = new Date(dateObj.setDate(diff + 6));
        startDate = start.toISOString().split("T")[0];
        endDate = end.toISOString().split("T")[0];
      } else if (reportType === "monthly") {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        startDate = new Date(year, month, 1).toISOString().split("T")[0];
        endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
      } else if (reportType === "yearly") {
        const year = dateObj.getFullYear();
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
      }

      const params = { startDate, endDate };
      if (selectedBranch !== "all") params.branchId = selectedBranch;

      const res = await api.get("/stats", { params });
      setReportStats(res.data);
    } catch (err) {
      console.error("Error fetching report stats:", err);
      showToast(
        err.response?.data?.message || "Error fetching report stats",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Calendar Data
  const fetchCalendarData = async () => {
    if (!calendarStaffId) return;

    try {
      setLoading(true);
      const [year, month] = calendarMonth.split("-");
      const startDate = `${year}-${month}-01`;
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];

      const params = {
        staffId: calendarStaffId,
        startDate,
        endDate,
      };

      const res = await api.get("/calendar", { params });
      setCalendarData(res.data);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
      showToast(
        err.response?.data?.message || "Error fetching calendar data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---

  useEffect(() => {
    if (activeTab === "daily") {
      fetchAttendance();
    }
  }, [selectedDate, selectedBranch, activeTab]);

  useEffect(() => {
    if (activeTab === "report") {
      fetchReportStats();
    }
  }, [reportType, reportDate, selectedBranch, activeTab]);

  useEffect(() => {
    if (activeTab === "calendar" && calendarStaffId) {
      fetchCalendarData();
    }
  }, [calendarMonth, calendarStaffId, activeTab]);

  // --- Derived State for Daily View ---

  const filteredStaffList = useMemo(() => {
    if (!searchQuery.trim()) return staffList;
    const query = searchQuery.toLowerCase();
    return staffList.filter(
      (staff) =>
        staff.name?.toLowerCase().includes(query) ||
        staff.phone?.toLowerCase().includes(query)
    );
  }, [staffList, searchQuery]);

  const dailyStats = useMemo(() => {
    const total = staffList.length;
    const present = staffList.filter((s) => s.attendance === "present").length;
    const absent = staffList.filter((s) => s.attendance === "absent").length;
    const onLeave = staffList.filter((s) => s.attendance === "on-leave").length;
    const unmarked = total - present - absent - onLeave;
    return { total, present, absent, onLeave, unmarked };
  }, [staffList]);

  // --- Handlers ---

  const markAttendance = async (staffId, status) => {
    try {
      setMarkingId(staffId);
      await api.post("/mark", { staffId, date: selectedDate, status });
      setStaffList((prev) =>
        prev.map((s) => (s._id === staffId ? { ...s, attendance: status } : s))
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Error marking attendance",
        "error"
      );
    } finally {
      setMarkingId(null);
    }
  };

  const markAll = async (status) => {
    try {
      setBulkLoading(true);
      const records = filteredStaffList.map((s) => ({
        staffId: s._id,
        status,
      }));
      await api.post("/mark-bulk", { date: selectedDate, records });
      setStaffList((prev) =>
        prev.map((s) => {
          const isInFiltered = filteredStaffList.find((f) => f._id === s._id);
          return isInFiltered ? { ...s, attendance: status } : s;
        })
      );
      showToast(
        `${filteredStaffList.length} staff marked as ${status}`,
        "success"
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Error marking attendance",
        "error"
      );
    } finally {
      setBulkLoading(false);
    }
  };

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch ? branch.name : "Unknown";
  };

  // --- Components ---

  const renderDailyView = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon="ri-team-line"
          color="rose"
          label="Total Staff"
          value={dailyStats.total}
          sub="All employees"
        />
        <StatCard
          icon="ri-checkbox-circle-line"
          color="green"
          label="Present"
          value={dailyStats.present}
          sub="Checked in"
        />
        <StatCard
          icon="ri-close-circle-line"
          color="red"
          label="Absent"
          value={dailyStats.absent}
          sub="Not available"
        />
        <StatCard
          icon="ri-logout-box-r-line"
          color="blue"
          label="On Leave"
          value={dailyStats.onLeave}
          sub="Approved leave"
        />
        <StatCard
          icon="ri-question-line"
          color="yellow"
          label="Pending"
          value={dailyStats.unmarked}
          sub="Needs update"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <BulkButton
            onClick={() => markAll("present")}
            icon="ri-checkbox-circle-line"
            color="green"
            label="All Present"
            loading={bulkLoading}
            disabled={filteredStaffList.length === 0}
          />
          <BulkButton
            onClick={() => markAll("absent")}
            icon="ri-close-circle-line"
            color="red"
            label="All Absent"
            loading={bulkLoading}
            disabled={filteredStaffList.length === 0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaffList.map((member) => (
          <div
            key={member._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-lg">
                    {member.name ? member.name.charAt(0) : "S"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                      {member.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {member.role || "Staff"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={member.attendance || "pending"} />
              </div>

              <div className="space-y-1.5 mb-5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <i className="ri-building-line text-rose-400"></i>
                  <span>{getBranchName(member.branchId)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <i className="ri-phone-line text-rose-400"></i>
                  <span>{member.phone || "No Phone"}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <ActionButton
                  onClick={() => markAttendance(member._id, "present")}
                  active={member.attendance === "present"}
                  disabled={markingId === member._id}
                  icon="ri-checkbox-circle-line"
                  color="green"
                  label="P"
                />
                <ActionButton
                  onClick={() => markAttendance(member._id, "absent")}
                  active={member.attendance === "absent"}
                  disabled={markingId === member._id}
                  icon="ri-close-circle-line"
                  color="red"
                  label="A"
                />
                <ActionButton
                  onClick={() => markAttendance(member._id, "on-leave")}
                  active={member.attendance === "on-leave"}
                  disabled={markingId === member._id}
                  icon="ri-logout-box-r-line"
                  color="blue"
                  label="L"
                />
              </div>
            </div>
          </div>
        ))}
        {filteredStaffList.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500">
            No staff found matching your filters.
          </div>
        )}
      </div>
    </>
  );

  const renderReportView = () => {
    if (!reportStats) return null;

    const data = [
      { name: "Present", value: reportStats.present, fill: "#22c55e" },
      { name: "Absent", value: reportStats.absent, fill: "#ef4444" },
      { name: "On Leave", value: reportStats["on-leave"], fill: "#3b82f6" },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex gap-2">
            {["weekly", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === type
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <input
            type={reportType === "yearly" ? "number" : "date"}
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon="ri-checkbox-circle-line"
            color="green"
            label="Total Present"
            value={reportStats.present}
            sub="Days"
          />
          <StatCard
            icon="ri-close-circle-line"
            color="red"
            label="Total Absent"
            value={reportStats.absent}
            sub="Days"
          />
          <StatCard
            icon="ri-logout-box-r-line"
            color="blue"
            label="Total Leaves"
            value={reportStats["on-leave"]}
            sub="Days"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Attendance Overview
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                barSize={60}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    // Generate calendar grid
    const [year, month] = calendarMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sun
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50" />);
    }

    // Days with data
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const status = calendarData?.calendar?.[dateStr];

      let statusColor = "bg-white hover:bg-gray-50";
      let statusIcon = null;

      if (status === "present") {
        statusColor = "bg-green-50 border-green-100";
        statusIcon = <i className="ri-checkbox-circle-fill text-green-500"></i>;
      } else if (status === "absent") {
        statusColor = "bg-red-50 border-red-100";
        statusIcon = <i className="ri-close-circle-fill text-red-500"></i>;
      } else if (status === "on-leave") {
        statusColor = "bg-blue-50 border-blue-100";
        statusIcon = <i className="ri-logout-box-r-fill text-blue-500"></i>;
      }

      days.push(
        <div
          key={day}
          className={`h-24 p-2 border border-gray-100 rounded-lg transition-all flex flex-col justify-between ${statusColor}`}
        >
          <span className={`text-sm font-semibold ${status ? "text-gray-900" : "text-gray-400"}`}>{day}</span>
          {status && (
            <div className="self-end">
              {statusIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <select
            value={calendarStaffId}
            onChange={(e) => setCalendarStaffId(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-rose-400 outline-none"
          >
            <option value="">Select Staff Member</option>
            {allStaff.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={calendarMonth}
            onChange={(e) => setCalendarMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-rose-400 outline-none"
          />
        </div>

        {calendarStaffId && calendarData?.summary ? (
          <>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">Present: {calendarData.summary.present} days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-700">Absent: {calendarData.summary.absent} days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">Leave: {calendarData.summary["on-leave"]} days</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">{days}</div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <i className="ri-user-search-line text-4xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">Select a staff member to view their calendar</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <main className="min-h-screen bg-gray-50/50 lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Attendance Management
              </h1>
              <p className="text-gray-600 text-sm">
                Track and monitor staff attendance and reports
              </p>
            </div>

            {/* Branch Switcher */}
            <div className="w-full lg:w-auto">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Branch Scope
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full lg:w-64 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white text-sm"
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

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
            <TabButton
              active={activeTab === "daily"}
              onClick={() => setActiveTab("daily")}
              label="Daily View"
              icon="ri-list-check"
            />
            <TabButton
              active={activeTab === "report"}
              onClick={() => setActiveTab("report")}
              label="Reports"
              icon="ri-bar-chart-box-line"
            />
            <TabButton
              active={activeTab === "calendar"}
              onClick={() => setActiveTab("calendar")}
              label="Calendar View"
              icon="ri-calendar-todo-line"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in-up">
          {activeTab === "daily" && (
            <>
              {/* Date Selector for Daily View */}
              <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-fit">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-rose-400 outline-none text-sm"
                  />
                  {selectedDate === todayStr && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">Today</span>
                  )}
                </div>
              </div>
              {renderDailyView()}
            </>
          )}
          {activeTab === "report" && renderReportView()}
          {activeTab === "calendar" && renderCalendarView()}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
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

// Sub-components for cleaner code
const StatCard = ({ icon, color, label, value, sub }) => (
  <div
    className={`bg-white rounded-2xl p-5 shadow-sm border border-${color}-100 hover:shadow-md transition-all group`}
  >
    <div className="flex items-center justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}
      >
        <i className={`${icon} text-${color}-500 text-xl`}></i>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider text-${color}-600 bg-${color}-50 px-2 py-0.5 rounded-full`}
      >
        {label}
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{sub}</p>
  </div>
);

const TabButton = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${active
        ? "bg-gray-900 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-50"
      }`}
  >
    <i className={icon}></i>
    {label}
  </button>
);

const BulkButton = ({ onClick, icon, color, label, loading, disabled }) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`px-4 py-2 bg-${color}-500 text-white rounded-xl text-sm font-medium hover:bg-${color}-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md`}
  >
    <i className={icon}></i>
    {label}
  </button>
);

const ActionButton = ({ onClick, active, disabled, icon, color, label }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    disabled={disabled}
    className={`h-9 rounded-lg flex items-center justify-center transition-all ${active
        ? `bg-${color}-500 text-white shadow-${color}-500/30 shadow-lg scale-105`
        : `bg-gray-50 text-gray-400 hover:bg-${color}-50 hover:text-${color}-500 hover:scale-105`
      }`}
  >
    <i className={`${icon} ${active ? "text-lg" : "text-base"}`}></i>
  </button>
);

const StatusBadge = ({ status }) => {
  const styles = {
    present: "bg-green-50 text-green-700 border-green-200",
    absent: "bg-red-50 text-red-700 border-red-200",
    "on-leave": "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  }[status] || "bg-gray-50 text-gray-700 border-gray-200";

  const label = {
    present: "Present",
    absent: "Absent",
    "on-leave": "On Leave",
    pending: "Pending",
  }[status] || "Unknown";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles}`}
    >
      {label}
    </span>
  );
};

export default AdminAttendance;