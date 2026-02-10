import React from "react";
import { useNavigate } from "react-router-dom";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddBranchForm = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  onToggleDay,
  error, // 🆕 Pass error from parent
  isSubmitting, // 🆕 Pass loading state from parent
}) => {
  const navigate = useNavigate();

  // 🆕 Handle subscription limit error
  const handleUpgradeRedirect = () => {
    onClose(); // Close the modal
    navigate("/admin/settings?tab=subscriptions"); // Navigate to subscriptions tab
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Add New Branch</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* 🆕 Subscription Limit Error Alert */}
      {error?.details?.limitReached && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <i className="ri-error-warning-line text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 mb-1">
                Branch Limit Reached
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                {error.message}
              </p>
              <div className="flex flex-col xs:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleUpgradeRedirect}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/30"
                >
                  <i className="ri-vip-crown-line mr-2"></i>
                  Upgrade Plan
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Regular Error Alert */}
      {error && !error?.details?.limitReached && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <i className="ri-error-warning-line text-red-500 text-xl mt-0.5"></i>
            <div>
              <h4 className="font-bold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-800">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Branch Name */}
      <input
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Branch Name"
        className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
        required
        disabled={isSubmitting} // 🆕 Disable while submitting
      />

      {/* Address */}
      <input
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
        disabled={isSubmitting}
      />

      {/* City State Zip */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
        <input
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="City"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
        <input
          name="state"
          value={formData.state}
          onChange={onChange}
          placeholder="State"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
        <input
          name="zipCode"
          value={formData.zipCode}
          onChange={onChange}
          placeholder="Zip Code"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Phone Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Phone"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
        <input
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="time"
          name="openingTime"
          value={formData.openingTime}
          onChange={onChange}
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
        <input
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={onChange}
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Working Days */}
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">Working Days</p>
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onToggleDay(d)}
              disabled={isSubmitting}
              className={`px-3 py-1 rounded-lg text-sm font-semibold border transition ${
                formData.workingDays.includes(d)
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-3.5 sm:py-3 rounded-xl text-base sm:text-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <i className="ri-loader-4-line animate-spin"></i>
            Adding Branch...
          </span>
        ) : (
          "Add Branch"
        )}
      </button>
    </form>
  );
};

export default AddBranchForm;