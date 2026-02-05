import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import AddBranchForm from "../components/AddBranchForm.jsx";

const AdminBranches = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({
    name: "Main Branch - Artist Village",
    address: "123 Beauty Street",
    city: "Artist Village",
    isActive: true,
  });

  const [branches, setBranches] = useState([
    {
      _id: "1",
      name: "Main Branch - Artist Village",
      address: "123 Beauty Street",
      city: "Artist Village",
      state: "Maharashtra",
      zipCode: "400001",
      phone: "+91 98765 43210",
      email: "main@beautysalon.com",
      openingTime: "09:00",
      closingTime: "20:00",
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      isActive: true,
      createdAt: "2024-01-15",
    },
    {
      _id: "2",
      name: "Downtown Branch",
      address: "456 Style Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400002",
      phone: "+91 98765 43211",
      email: "downtown@beautysalon.com",
      openingTime: "10:00",
      closingTime: "21:00",
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      isActive: true,
      createdAt: "2024-02-20",
    },
    {
      _id: "3",
      name: "Suburban Spa & Salon",
      address: "789 Glamour Road",
      city: "Thane",
      state: "Maharashtra",
      zipCode: "400603",
      phone: "+91 98765 43212",
      email: "suburban@beautysalon.com",
      openingTime: "09:30",
      closingTime: "19:30",
      workingDays: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      isActive: true,
      createdAt: "2024-03-10",
    },
    {
      _id: "4",
      name: "Luxury Lounge - Bandra",
      address: "321 Posh Lane",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91 98765 43213",
      email: "luxury@beautysalon.com",
      openingTime: "11:00",
      closingTime: "22:00",
      workingDays: ["Wed", "Thu", "Fri", "Sat", "Sun"],
      isActive: false,
      createdAt: "2023-12-05",
    },
  ]);

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
    totalBranches: 4,
    activeBranches: 3,
    totalStaff: 48,
    totalRevenue: 156780,
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the branch
    const newBranch = {
      ...formData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBranches((prev) => [...prev, newBranch]);
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
  };

  const toggleBranchStatus = (branchId) => {
    setBranches((prev) =>
      prev.map((branch) =>
        branch._id === branchId
          ? { ...branch, isActive: !branch.isActive }
          : branch,
      ),
    );
  };

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
                <h2 className="text-2xl font-bold">{currentBranch.name}</h2>
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
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
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
                    onClick={() => toggleBranchStatus(branch._id)}
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
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <i className="ri-map-pin-line text-rose-500 mt-0.5"></i>
                    <span>
                      {branch.address}, {branch.city}, {branch.state} -{" "}
                      {branch.zipCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <i className="ri-phone-line text-rose-500"></i>
                      {branch.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-mail-line text-rose-500"></i>
                    {branch.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-time-line text-rose-500"></i>
                    <span>
                      {branch.openingTime} - {branch.closingTime}
                    </span>
                  </div>
                </div>

                {/* Working Days */}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <i className="ri-add-line text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Add New Branch</h2>
                    <p className="text-white/80 text-sm">
                      Fill in the details below
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl w-full max-w-2xl">
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
