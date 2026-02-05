import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import AddBranchForm from "../components/AddBranchForm.jsx";
import { useBranch } from "../context/BranchContext";

const AdminBranches = () => {
  const {
    branches,
    currentBranch,
    loading,
    error,
    createBranch,
    toggleBranchStatus,
    switchBranch,
  } = useBranch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    openingTime: "",
    closingTime: "",
    workingDays: [],
    isActive: true,
  });

  const [stats, setStats] = useState({
    totalBranches: 0,
    activeBranches: 0,
    totalStaff: 0,
    totalRevenue: 0,
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate stats when branches change
  useEffect(() => {
    setStats({
      totalBranches: branches.length,
      activeBranches: branches.filter((b) => b.isActive).length,
      totalStaff: 0, // You can calculate this based on actual staff data
      totalRevenue: 0, // You can calculate this based on actual revenue data
    });
  }, [branches]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    try {
      await createBranch(formData);
      setShowAddModal(false);
      // Reset form
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        openingTime: "",
        closingTime: "",
        workingDays: [],
        isActive: true,
      });
    } catch (err) {
      alert(`Error creating branch: ${err.message}`);
    }
  };

  const handleToggleStatus = async (branchId, event) => {
    event.stopPropagation();
    try {
      await toggleBranchStatus(branchId);
    } catch (err) {
      alert(`Error updating branch status: ${err.message}`);
    }
  };

  const handleBranchSelect = (branch) => {
    switchBranch(branch);
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading branches...</p>
            </div>
          </div>
        </main>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
              <p className="text-gray-600 mb-4">Error loading branches: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-rose-500 text-white rounded-xl font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </AdminLayout>
    );
  }

  // Empty state - No branches created yet
  if (branches.length === 0) {
    return (
      <AdminLayout>
        <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Branch Management
            </h1>
            <p className="text-gray-600">
              Manage all your salon locations and branches
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-64 h-64 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-8">
              <i className="ri-store-2-line text-rose-500 text-8xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Branches Yet
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Get started by creating your first branch. You can manage multiple
              locations and switch between them easily.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              <i className="ri-add-line text-xl"></i>
              Create Your First Branch
            </button>
          </div>
        </main>

        {/* Add Branch Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden">
              <AddBranchForm
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
                Branch Management
              </h1>
              <p className="text-gray-600">
                Manage all your salon locations and branches
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2 w-fit"
            >
              <i className="ri-add-line text-xl"></i>
              Add New Branch
            </button>
          </div>
        </div>

        {/* Current Branch Card */}
        {currentBranch && (
          <div className="mb-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <i className="ri-map-pin-line text-2xl"></i>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    Currently Viewing
                  </p>
                  <div className="relative inline-block">
                    <select
                      value={currentBranch._id}
                      onChange={(e) => {
                        const selected = branches.find(
                          (b) => b._id === e.target.value
                        );
                        if (selected) handleBranchSelect(selected);
                      }}
                      className="appearance-none bg-white/20 backdrop-blur-md text-white font-bold text-xl rounded-xl px-5 py-3 pr-12
               border border-white/30 shadow-lg cursor-pointer
               hover:bg-white/25 focus:bg-white/25 focus:outline-none
               transition-all"
                    >
                      {branches.map((branch) => (
                        <option
                          key={branch._id}
                          value={branch._id}
                          className="text-gray-900 font-semibold"
                        >
                          {branch.name}
                        </option>
                      ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/80">
                      <i className="ri-arrow-down-s-line text-2xl"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <i className="ri-map-pin-2-line"></i>
                  {currentBranch.address}, {currentBranch.city}
                </span>
                <span className="flex items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i>
                  {currentBranch.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <i className="ri-building-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Branches
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalBranches}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Branches
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activeBranches}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <i className="ri-team-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Staff
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalStaff}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <i className="ri-money-rupee-circle-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Combined Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch._id}
              onClick={() => handleBranchSelect(branch)}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group
    ${currentBranch?._id === branch._id ? "ring-2 ring-rose-400" : ""}
  `}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="ri-store-2-line text-rose-600 text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Since {new Date(branch.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleToggleStatus(branch._id, e)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${
                      branch.isActive
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {branch.isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  {branch.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="ri-map-pin-line text-rose-500 mt-0.5"></i>
                      <span>
                        {branch.address}
                        {branch.city && `, ${branch.city}`}
                        {branch.state && `, ${branch.state}`}
                        {branch.zipCode && ` - ${branch.zipCode}`}
                      </span>
                    </div>
                  )}
                  {branch.phone && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <i className="ri-phone-line text-rose-500"></i>
                        {branch.phone}
                      </span>
                    </div>
                  )}
                  {branch.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="ri-mail-line text-rose-500"></i>
                      {branch.email}
                    </div>
                  )}
                  {branch.openingTime && branch.closingTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="ri-time-line text-rose-500"></i>
                      <span>
                        {branch.openingTime} - {branch.closingTime}
                      </span>
                    </div>
                  )}
                </div>

                {/* Working Days */}
                {branch.workingDays && branch.workingDays.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      WORKING DAYS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => (
                        <span
                          key={day}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            branch.workingDays.includes(day)
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="flex-1 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg font-semibold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                    <i className="ri-edit-line"></i>
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    <i className="ri-eye-line"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full animate-slideUp overflow-hidden">
            <AddBranchForm
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminBranches;