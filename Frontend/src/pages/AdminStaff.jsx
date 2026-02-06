import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import AddStaffForm from "../components/AddStaffForm.jsx";
import EditStaffForm from "../components/EditStaffForm.jsx";
import { useBranch } from "../context/BranchContext";

const AdminStaff = () => {
  const { currentBranch } = useBranch();

  const [staff, setStaff] = useState([
    {
      _id: "1",
      ownerId: "owner123",
      branchId: "branch1",
      name: "Emma Williams",
      email: "emma@beautysalon.com",
      phone: "+91 9876543210",
      role: "Senior Stylist",
      specialization: ["Haircut", "Hair Color", "Styling"],
      status: "active",
      joiningDate: new Date("2023-01-15"),
      salary: 85000,
      commission: 15,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      workingHours: {
        start: "09:00 AM",
        end: "06:00 PM",
      },
    },
    {
      _id: "2",
      ownerId: "owner123",
      branchId: "branch1",
      name: "Priya Sharma",
      email: "priya@beautysalon.com",
      phone: "+91 9123456780",
      role: "Makeup Artist",
      specialization: ["Bridal Makeup", "Party Makeup", "Natural Makeup"],
      status: "active",
      joiningDate: new Date("2022-03-20"),
      salary: 92000,
      commission: 20,
      workingDays: ["Mon", "Tue", "Wed", "Fri", "Sat"],
      workingHours: {
        start: "10:00 AM",
        end: "07:00 PM",
      },
    },
    {
      _id: "3",
      ownerId: "owner123",
      branchId: "branch1",
      name: "Lisa Anderson",
      email: "lisa@beautysalon.com",
      phone: "+91 9988776655",
      role: "Spa Therapist",
      specialization: ["Swedish Massage", "Aromatherapy", "Hot Stone"],
      status: "active",
      joiningDate: new Date("2023-07-10"),
      salary: 65000,
      commission: 12,
      workingDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
      workingHours: {
        start: "09:00 AM",
        end: "05:00 PM",
      },
    },
    {
      _id: "4",
      ownerId: "owner123",
      branchId: "branch1",
      name: "Maria Garcia",
      email: "maria@beautysalon.com",
      phone: "+91 9445566778",
      role: "Bridal Specialist",
      specialization: ["Bridal Makeup", "Bridal Hair", "Saree Draping"],
      status: "active",
      joiningDate: new Date("2021-02-15"),
      salary: 78000,
      commission: 18,
      workingDays: ["Wed", "Thu", "Fri", "Sat", "Sun"],
      workingHours: {
        start: "08:00 AM",
        end: "06:00 PM",
      },
    },
    {
      _id: "5",
      ownerId: "owner123",
      branchId: "branch1",
      name: "John Smith",
      email: "john@beautysalon.com",
      phone: "+91 9334455667",
      role: "Barber",
      specialization: ["Haircut", "Beard Styling", "Hair Treatment"],
      status: "on-leave",
      joiningDate: new Date("2023-09-05"),
      salary: 58000,
      commission: 10,
      workingDays: ["Mon", "Tue", "Thu", "Fri", "Sat"],
      workingHours: {
        start: "09:00 AM",
        end: "06:00 PM",
      },
    },
    {
      _id: "6",
      ownerId: "owner123",
      branchId: "branch1",
      name: "Anjali Verma",
      email: "anjali@beautysalon.com",
      phone: "+91 9223344556",
      role: "Nail Technician",
      specialization: ["Manicure", "Pedicure", "Nail Art", "Gel Polish"],
      status: "active",
      joiningDate: new Date("2022-11-12"),
      salary: 72000,
      commission: 14,
      workingDays: ["Mon", "Wed", "Thu", "Fri", "Sat"],
      workingHours: {
        start: "10:00 AM",
        end: "07:00 PM",
      },
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    branchId: "",
    specialization: "",
    salary: "",
    commission: "",
    workingDays: [],
    workingHours: {
      start: "",
      end: "",
    },
    status: "active",
  });

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const roles = [
    "all",
    "Receptionist",
    "Stylist",
    "Makeup Artist",
    "Spa Therapist",
    "Barber",
    "Nail Technician",
    "Bridal Specialist",
    "Manager",
    "Assistant",
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    onLeaveStaff: 0,
    inactiveStaff: 0,
  });

  // Reset form when opening ADD modal
  useEffect(() => {
    if (showAddModal) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        branchId: "",
        specialization: "",
        salary: "",
        commission: "",
        workingDays: [],
        workingHours: {
          start: "",
          end: "",
        },
        status: "active",
      });
    }
  }, [showAddModal]);

  // Populate form ONLY when opening EDIT modal
  useEffect(() => {
    if (showEditModal && editingStaff) {
      setFormData({
        name: editingStaff.name || "",
        email: editingStaff.email || "",
        phone: editingStaff.phone || "",
        password: "",
        role: editingStaff.role || "",
        branchId: editingStaff.branchId || "",
        specialization: Array.isArray(editingStaff.specialization)
          ? editingStaff.specialization.join(", ")
          : "",
        salary: editingStaff.salary || "",
        commission: editingStaff.commission || "",
        workingDays: editingStaff.workingDays || [],
        workingHours: {
          start: editingStaff.workingHours?.start || "",
          end: editingStaff.workingHours?.end || "",
        },
        status: editingStaff.status || "active",
      });
    }
  }, [showEditModal, editingStaff]);

  // Calculate stats when staff changes
  useEffect(() => {
    setStats({
      totalStaff: staff.length,
      activeStaff: staff.filter((s) => s.status === "active").length,
      onLeaveStaff: staff.filter((s) => s.status === "on-leave").length,
      inactiveStaff: staff.filter((s) => s.status === "inactive").length,
    });
  }, [staff]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getStatusStyles = (status) => {
    if (status === "active")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "on-leave")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (status === "inactive") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const filteredStaff = staff.filter((m) => {
    return (
      (filterStatus === "all" || m.status === filterStatus) &&
      (filterRole === "all" || m.role === filterRole)
    );
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleWorkingDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.workingDays.length < 1) {
      alert("Please select at least one working day.");
      return;
    }

    try {
      const newStaff = {
        _id: Date.now().toString(),
        ...formData,
        specialization: formData.specialization
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        joiningDate: new Date(),
      };

      setStaff((prev) => [...prev, newStaff]);
      setShowAddModal(false);
    } catch (err) {
      alert(`Error creating staff: ${err.message}`);
    }
  };

  const handleEditClick = (member, event) => {
    event.stopPropagation();
    setEditingStaff(member);
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (formData.workingDays.length < 1) {
      alert("Please select at least one working day.");
      return;
    }

    try {
      setStaff((prev) =>
        prev.map((s) =>
          s._id === editingStaff._id
            ? {
                ...s,
                ...formData,
                specialization: formData.specialization
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s),
              }
            : s
        )
      );
      setShowEditModal(false);
      setEditingStaff(null);
    } catch (err) {
      alert(`Error updating staff: ${err.message || err}`);
    }
  };

  const handleDeleteClick = (staffId, event) => {
    event.stopPropagation();
    setStaffToDelete(staffId);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    try {
      setStaff((prev) => prev.filter((s) => s._id !== staffToDelete));
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (err) {
      alert(`Error deleting staff: ${err.message || err}`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStaffToDelete(null);
  };

  const toggleMenu = (staffId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === staffId ? null : staffId);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Empty state - No staff created yet
  if (staff.length === 0) {
    return (
      <AdminLayout>
        <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Staff Management
            </h1>
            <p className="text-gray-600">Manage and track all staff members</p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-64 h-64 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-8">
              <i className="ri-team-line text-rose-500 text-8xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Staff Members Yet
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Get started by adding your first staff member. You can manage
              their schedules, salaries, and performance all in one place.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              <i className="ri-user-add-line text-xl"></i>
              Add Your First Staff Member
            </button>
          </div>
        </main>

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden">
              <AddStaffForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                onClose={() => setShowAddModal(false)}
                onToggleDay={handleWorkingDayToggle}
              />
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Staff Management
              </h1>
              <p className="text-gray-600">
                Manage and track all staff members
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2 w-fit"
            >
              <i className="ri-user-add-line text-xl"></i>
              Add New Staff
            </button>
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
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                All members
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Staff
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalStaff}
            </p>
            <p className="text-xs text-gray-500 mt-2">Across all roles</p>
          </div>

          {/* Active Staff */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
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
              {stats.activeStaff}
            </p>
            <p className="text-xs text-gray-500 mt-2">Working today</p>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
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
              {stats.onLeaveStaff}
            </p>
            <p className="text-xs text-gray-500 mt-2">Currently away</p>
          </div>

          {/* Inactive Staff */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-unfollow-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Inactive
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Inactive Staff
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.inactiveStaff}
            </p>
            <p className="text-xs text-gray-500 mt-2">Not working</p>
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

            {/* Role Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Role
              </label>
              <div className="flex gap-2 flex-wrap">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRole(r)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      filterRole === r
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {r === "all" ? "All Roles" : r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStaff.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="p-6">
                {/* Header with Name and 3-dot menu */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-200 text-xl flex-shrink-0">
                      {member.name.charAt(0)}
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

                  {/* 3-dot Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => toggleMenu(member._id, e)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <i className="ri-more-fill text-xl text-gray-600"></i>
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === member._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-10 animate-slideDown">
                        <button
                          onClick={(e) => handleEditClick(member, e)}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                        >
                          <i className="ri-edit-line text-blue-600"></i>
                          <span className="font-medium">Edit</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={(e) => handleDeleteClick(member._id, e)}
                          className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                        >
                          <i className="ri-delete-bin-line"></i>
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${getStatusStyles(member.status)}`}
                  >
                    {member.status === "on-leave"
                      ? "On Leave"
                      : member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                  </span>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 mb-4">
                  {member.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <i className="ri-mail-line text-gray-400"></i>
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <i className="ri-phone-line text-gray-400"></i>
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Specializations */}
                {member.specialization &&
                  member.specialization.length > 0 && (
                    <div className="mb-4">
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
                  )}

                {/* Working Hours and Salary */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                  {member.workingHours?.start && member.workingHours?.end && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="ri-time-line text-gray-400"></i>
                      <span>
                        {member.workingHours.start} - {member.workingHours.end}
                      </span>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Salary</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{member.salary?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Working Days & Additional Info */}
                <div className="space-y-3">
                  {member.workingDays && member.workingDays.length > 0 && (
                    <div className="flex gap-1.5">
                      {weekDays.map((day) => (
                        <span
                          key={day}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            member.workingDays.includes(day)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      <i className="ri-calendar-line text-gray-400 mr-1"></i>
                      Joined: {formatDate(member.joiningDate)}
                    </span>
                    {member.commission && (
                      <span className="text-gray-600 font-semibold">
                        Commission: {member.commission}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden">
            <AddStaffForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onClose={() => setShowAddModal(false)}
              onToggleDay={handleWorkingDayToggle}
            />
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden">
            <EditStaffForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handleEditSubmit}
              onClose={() => {
                setShowEditModal(false);
                setEditingStaff(null);
              }}
              onToggleDay={handleWorkingDayToggle}
              isEditMode={true}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideUp overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
                <i className="ri-delete-bin-line text-3xl text-rose-600"></i>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Staff Member?
              </h2>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All staff data will be permanently
                removed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminStaff;