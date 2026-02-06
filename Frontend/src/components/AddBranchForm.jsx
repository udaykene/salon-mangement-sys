const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddBranchForm = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  onToggleDay,
}) => {
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

      {/* Branch Name */}
      <input
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Branch Name"
        className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
        required
      />

      {/* Address */}
      <input
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
      />

      {/* City State Zip */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
        <input
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="City"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
        />
        <input
          name="state"
          value={formData.state}
          onChange={onChange}
          placeholder="State"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
        />
        <input
          name="zipCode"
          value={formData.zipCode}
          onChange={onChange}
          placeholder="Zip Code"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
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
        />
        <input
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
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
        />
        <input
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={onChange}
          className="w-full border rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-rose-400 outline-none"
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
              className={`px-3 py-1 rounded-lg text-sm font-semibold border transition ${
                formData.workingDays.includes(d)
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full mt-6 py-3.5 sm:py-3 rounded-xl text-base sm:text-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
      >
        Add Branch
      </button>
    </form>
  );
};

export default AddBranchForm;
