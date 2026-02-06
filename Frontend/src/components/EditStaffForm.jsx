import React from "react";
import { useBranch } from "../context/BranchContext";

const EditStaffForm = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  onToggleDay,
  isEditMode = false,
}) => {
  const { branches } = useBranch();

  const roles = [
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

  return (
    <form onSubmit={onSubmit} className="max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="ri-edit-line"></i>
            Edit Staff Member
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Update staff member details
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-user-line text-blue-500"></i>
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Jane Smith"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="jane@salon.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Password (optional for edit) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Role & Branch Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-briefcase-line text-blue-500"></i>
            Role & Assignment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch *
              </label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specializations */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specializations (comma separated)
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={onChange}
              placeholder="Haircut, Hair Color, Styling"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Compensation Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-money-rupee-circle-line text-blue-500"></i>
            Compensation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Salary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salary ($) *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={onChange}
                placeholder="3000"
                required
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commission (%)
              </label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={onChange}
                placeholder="10"
                min="0"
                max="100"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Working Schedule Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-calendar-line text-blue-500"></i>
            Working Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Working Hours Start */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Working Hours Start *
              </label>
              <input
                type="time"
                name="workingHours.start"
                value={formData.workingHours.start}
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Working Hours End */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Working Hours End *
              </label>
              <input
                type="time"
                name="workingHours.end"
                value={formData.workingHours.end}
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Working Days */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Working Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => onToggleDay(day)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    formData.workingDays.includes(day)
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {formData.workingDays.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                Please select at least one working day
              </p>
            )}
          </div>
        </div>

        {/* Status Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-checkbox-circle-line text-blue-500"></i>
            Status
          </h3>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === "active"}
                onChange={onChange}
                className="w-4 h-4 text-green-500 focus:ring-green-400"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="on-leave"
                checked={formData.status === "on-leave"}
                onChange={onChange}
                className="w-4 h-4 text-yellow-500 focus:ring-yellow-400"
              />
              <span className="text-sm font-medium text-gray-700">
                On Leave
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === "inactive"}
                onChange={onChange}
                className="w-4 h-4 text-red-500 focus:ring-red-400"
              />
              <span className="text-sm font-medium text-gray-700">
                Inactive
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <i className="ri-save-line"></i>
          Update Staff Member
        </button>
      </div>
    </form>
  );
};

export default EditStaffForm;