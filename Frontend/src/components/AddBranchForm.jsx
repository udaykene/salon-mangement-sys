const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddBranchForm = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  onToggleDay,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">

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
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-400 outline-none"
        required
      />

      {/* Address */}
      <input
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        className="w-full border rounded-xl px-4 py-3"
      />

      {/* City State Zip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="City"
          className="border rounded-xl px-4 py-3"
        />
        <input
          name="state"
          value={formData.state}
          onChange={onChange}
          placeholder="State"
          className="border rounded-xl px-4 py-3"
        />
        <input
          name="zipCode"
          value={formData.zipCode}
          onChange={onChange}
          placeholder="Zip Code"
          className="border rounded-xl px-4 py-3"
        />
      </div>

      {/* Phone Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Phone"
          className="border rounded-xl px-4 py-3"
        />
        <input
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          className="border rounded-xl px-4 py-3"
        />
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="time"
          name="openingTime"
          value={formData.openingTime}
          onChange={onChange}
          className="border rounded-xl px-4 py-3"
        />
        <input
          type="time"
          name="closingTime"
          value={formData.closingTime}
          onChange={onChange}
          className="border rounded-xl px-4 py-3"
        />
      </div>

      {/* Working Days */}
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">
          Working Days
        </p>
        <div className="flex flex-wrap gap-2">
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
        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
      >
        Create Branch
      </button>
    </form>
  );
};

export default AddBranchForm;
